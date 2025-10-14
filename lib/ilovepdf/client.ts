import axios, { AxiosInstance } from 'axios';

export type PDFTool =
  | 'merge'
  | 'split'
  | 'compress'
  | 'officepdf'
  | 'pdfdocx'
  | 'imagepdf'
  | 'pdfjpg'
  | 'protect'
  | 'unlock'
  | 'watermark'
  | 'rotate'
  | 'pagenumber'
  | 'ocr'
  | 'sign';

export interface TaskResponse {
  server: string;
  task: string;
}

export interface FileUploadResponse {
  server_filename: string;
  filename: string;
}

export interface ProcessParams {
  files?: FileUploadResponse[];
  [key: string]: any;
}

export class ILovePDFClient {
  private publicKey: string;
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private axios: AxiosInstance;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
    this.axios = axios.create({
      timeout: 120000, // 2 minutes
    });
  }

  /**
   * Authenticate and get JWT token (cached)
   */
  private async getToken(): Promise<string> {
    // Return cached token if still valid
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    try {
      const response = await this.axios.post(
        'https://api.ilovepdf.com/v1/auth',
        { public_key: this.publicKey }
      );

      this.token = response.data.token;
      // Token expires in 1 hour, cache for 50 minutes
      this.tokenExpiry = Date.now() + 50 * 60 * 1000;

      return this.token;
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  /**
   * Start a new task
   */
  async startTask(tool: PDFTool): Promise<TaskResponse> {
    const token = await this.getToken();

    try {
      const response = await this.axios.get(
        `https://api.ilovepdf.com/v1/start/${tool}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to start ${tool} task: ${error.message}`);
    }
  }

  /**
   * Upload file to task
   */
  async uploadFile(
    task: TaskResponse,
    fileBuffer: Buffer,
    filename: string
  ): Promise<FileUploadResponse> {
    const token = await this.getToken();

    try {
      // Determine MIME type based on file extension
      const getMimeType = (fname: string) => {
        if (fname.endsWith('.pdf')) return 'application/pdf';
        if (fname.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if (fname.endsWith('.doc')) return 'application/msword';
        if (fname.endsWith('.jpg') || fname.endsWith('.jpeg')) return 'image/jpeg';
        if (fname.endsWith('.png')) return 'image/png';
        return 'application/octet-stream';
      };

      const formData = new FormData();
      formData.append('task', task.task);
      formData.append('file', new Blob([fileBuffer], { type: getMimeType(filename) }), filename);

      console.log('📤 Uploading:', filename, fileBuffer.length, 'bytes');

      const response = await this.axios.post(
        `https://${task.server}/v1/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('✅ Uploaded:', response.data.server_filename);
      return response.data;
    } catch (error: any) {
      console.error('❌ Upload failed:', error.response?.data || error.message);
      throw new Error(`Failed to upload file: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Process task with parameters
   * IMPORTANT: iLovePDF expects ONLY these keys in process request:
   * - task (required)
   * - tool (required) 
   * - files (optional, but usually required)
   * - tool-specific params (e.g., compression_level)
   */
  async processTask(
    task: TaskResponse,
    params: ProcessParams
  ): Promise<void> {
    const token = await this.getToken();

    try {
      // Build minimal request body
      const requestBody: any = {
        task: task.task,
      };

      // Add ONLY the params we need, excluding undefined/null
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          requestBody[key] = params[key];
        }
      });

      console.log('Processing task with body:', JSON.stringify(requestBody, null, 2));

      const response = await this.axios.post(
        `https://${task.server}/v1/process`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('✅ Process successful:', response.data);
    } catch (error: any) {
      console.error('❌ Process error details:', {
        url: `https://${task.server}/v1/process`,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        requestBody: JSON.stringify(requestBody, null, 2)
      });
      throw new Error(`Failed to process task: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Download processed file
   */
  async downloadFile(task: TaskResponse): Promise<Buffer> {
    const token = await this.getToken();

    try {
      const response = await this.axios.get(
        `https://${task.server}/v1/download/${task.task}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'arraybuffer',
        }
      );

      return Buffer.from(response.data);
    } catch (error: any) {
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

  /**
   * Delete task (cleanup)
   */
  async deleteTask(task: TaskResponse): Promise<void> {
    const token = await this.getToken();

    try {
      await this.axios.delete(
        `https://${task.server}/v1/task/${task.task}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error: any) {
      // Don't throw error on delete failure
      console.warn('Failed to delete task:', error.message);
    }
  }

  /**
   * Complete workflow: Upload → Process → Download
   */
  async execute(
    tool: PDFTool,
    files: { buffer: Buffer; filename: string }[],
    params: Omit<ProcessParams, 'files' | 'tool'> = {}
  ): Promise<Buffer> {
    let task: TaskResponse | null = null;

    try {
      // Start task
      task = await this.startTask(tool);

      // Upload files
      const uploadedFiles = await Promise.all(
        files.map((file) =>
          this.uploadFile(task!, file.buffer, file.filename)
        )
      );

      // Format files array per API docs: must include both server_filename AND filename
      const formattedFiles = uploadedFiles.map((uploaded, index) => ({
        server_filename: uploaded.server_filename,
        filename: files[index].filename,  // Original filename is REQUIRED
      }));

      // Process - MUST include 'tool' parameter per API docs
      await this.processTask(task, {
        tool: tool,  // REQUIRED by API
        files: formattedFiles,
        ...params,
      });

      // Download result
      const result = await this.downloadFile(task);

      // Cleanup
      if (task) {
        await this.deleteTask(task);
      }

      return result;
    } catch (error) {
      // Cleanup on error
      if (task) {
        await this.deleteTask(task);
      }
      throw error;
    }
  }
}

// Singleton instance
let clientInstance: ILovePDFClient | null = null;

export function getILovePDFClient(): ILovePDFClient {
  if (!clientInstance) {
    const publicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error('ILOVEPDF_PUBLIC_KEY is not set in environment variables');
    }
    clientInstance = new ILovePDFClient(publicKey);
  }
  return clientInstance;
}
