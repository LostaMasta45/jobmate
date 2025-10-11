type PDFTask = "merge" | "split" | "compress" | "pdfjpg" | "imagepdf" | "rotate" | "unlock" | "protect" | "watermark" | "repair";

interface PDFTaskResponse {
  server: string;
  task: string;
}

export class ILovePDFClient {
  private publicKey: string;
  private secretKey: string;

  constructor() {
    this.publicKey = process.env.ILOVEPDF_PUBLIC_KEY!;
    this.secretKey = process.env.ILOVEPDF_SECRET_KEY!;
  }

  private async getJWTToken(): Promise<string> {
    const response = await fetch("https://api.ilovepdf.com/v1/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_key: this.publicKey,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate with iLovePDF");
    }

    const data = await response.json();
    return data.token;
  }

  async startTask(task: PDFTask): Promise<PDFTaskResponse> {
    const token = await this.getJWTToken();

    const response = await fetch(`https://api.ilovepdf.com/v1/start/${task}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to start ${task} task`);
    }

    return await response.json();
  }

  async uploadFile(server: string, task: string, file: File): Promise<string> {
    const token = await this.getJWTToken();
    const formData = new FormData();
    formData.append("task", task);
    formData.append("file", file);

    const response = await fetch(`https://${server}/v1/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await response.json();
    return data.server_filename;
  }

  async processTask(
    server: string,
    task: string,
    taskType: PDFTask,
    files: string[],
    options?: Record<string, any>
  ): Promise<{ downloadUrl: string }> {
    const token = await this.getJWTToken();

    const response = await fetch(`https://${server}/v1/process`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task,
        tool: taskType,
        files: files.map((file) => ({ server_filename: file })),
        ...options,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to process PDF");
    }

    const data = await response.json();
    return {
      downloadUrl: `https://${server}/v1/download/${task}`,
    };
  }

  async mergePDFs(files: File[]): Promise<string> {
    const { server, task } = await this.startTask("merge");
    
    const uploadedFiles = await Promise.all(
      files.map((file) => this.uploadFile(server, task, file))
    );

    const { downloadUrl } = await this.processTask(server, task, "merge", uploadedFiles);
    return downloadUrl;
  }

  async compressPDF(file: File, compressionLevel: "low" | "recommended" | "extreme" = "recommended"): Promise<string> {
    const { server, task } = await this.startTask("compress");
    const uploadedFile = await this.uploadFile(server, task, file);

    const { downloadUrl } = await this.processTask(server, task, "compress", [uploadedFile], {
      compression_level: compressionLevel,
    });

    return downloadUrl;
  }

  async imageToPDF(files: File[]): Promise<string> {
    const { server, task } = await this.startTask("imagepdf");
    
    const uploadedFiles = await Promise.all(
      files.map((file) => this.uploadFile(server, task, file))
    );

    const { downloadUrl } = await this.processTask(server, task, "imagepdf", uploadedFiles);
    return downloadUrl;
  }
}

export const pdfClient = new ILovePDFClient();
