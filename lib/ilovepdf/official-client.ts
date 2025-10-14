// Official iLovePDF SDK wrapper
import ILovePDFApi from '@ilovepdf/ilovepdf-nodejs';

export class OfficialILovePDFClient {
  private instance: any;

  constructor(publicKey: string, secretKey: string) {
    this.instance = new ILovePDFApi(publicKey, secretKey);
  }

  /**
   * Compress PDF using official SDK
   */
  async compressPDF(fileBuffer: Buffer, filename: string, compressionLevel: 'low' | 'recommended' | 'extreme' = 'recommended'): Promise<Buffer> {
    try {
      console.log('🔄 Starting compress with official SDK...');
      console.log('   File:', filename, 'Size:', fileBuffer.length, 'bytes');
      console.log('   Level:', compressionLevel);

      const task = this.instance.newTask('compress');
      
      // Add file from buffer
      await task.addFile(fileBuffer, filename);
      
      // Set compression level
      task.setCompressionLevel(compressionLevel);
      
      // Process
      console.log('   Processing...');
      await task.process();
      
      // Download result
      console.log('   Downloading...');
      const resultBuffer = await task.download();
      
      console.log('✅ Compress completed!');
      console.log('   Original:', fileBuffer.length, 'bytes');
      console.log('   Compressed:', resultBuffer.length, 'bytes');
      console.log('   Reduction:', Math.round((1 - resultBuffer.length / fileBuffer.length) * 100), '%');
      
      return resultBuffer;
    } catch (error: any) {
      console.error('❌ Official SDK compress error:', error.message);
      throw error;
    }
  }

  /**
   * Merge PDFs using official SDK
   */
  async mergePDFs(files: { buffer: Buffer; filename: string }[]): Promise<Buffer> {
    try {
      console.log('🔄 Starting merge with official SDK...');
      console.log('   Files:', files.length);

      const task = this.instance.newTask('merge');
      
      // Add all files
      for (const file of files) {
        console.log('   Adding:', file.filename, file.buffer.length, 'bytes');
        await task.addFile(file.buffer, file.filename);
      }
      
      // Process
      console.log('   Processing...');
      await task.process();
      
      // Download result
      console.log('   Downloading...');
      const resultBuffer = await task.download();
      
      console.log('✅ Merge completed!');
      console.log('   Result size:', resultBuffer.length, 'bytes');
      
      return resultBuffer;
    } catch (error: any) {
      console.error('❌ Official SDK merge error:', error.message);
      throw error;
    }
  }

  /**
   * Convert Office to PDF using official SDK
   */
  async officeToPDF(fileBuffer: Buffer, filename: string): Promise<Buffer> {
    try {
      console.log('🔄 Starting Office to PDF with official SDK...');
      console.log('   File:', filename, 'Size:', fileBuffer.length, 'bytes');

      const task = this.instance.newTask('officepdf');
      
      await task.addFile(fileBuffer, filename);
      
      console.log('   Processing...');
      await task.process();
      
      console.log('   Downloading...');
      const resultBuffer = await task.download();
      
      console.log('✅ Conversion completed!');
      console.log('   Result size:', resultBuffer.length, 'bytes');
      
      return resultBuffer;
    } catch (error: any) {
      console.error('❌ Official SDK convert error:', error.message);
      throw error;
    }
  }

  /**
   * Convert images to PDF using official SDK
   */
  async imagesToPDF(files: { buffer: Buffer; filename: string }[]): Promise<Buffer> {
    try {
      console.log('🔄 Starting images to PDF with official SDK...');
      console.log('   Files:', files.length);

      const task = this.instance.newTask('imagepdf');
      
      for (const file of files) {
        console.log('   Adding:', file.filename, file.buffer.length, 'bytes');
        await task.addFile(file.buffer, file.filename);
      }
      
      console.log('   Processing...');
      await task.process();
      
      console.log('   Downloading...');
      const resultBuffer = await task.download();
      
      console.log('✅ Conversion completed!');
      console.log('   Result size:', resultBuffer.length, 'bytes');
      
      return resultBuffer;
    } catch (error: any) {
      console.error('❌ Official SDK image convert error:', error.message);
      throw error;
    }
  }

  /**
   * Convert PDF to Word using official SDK
   */
  async pdfToWord(fileBuffer: Buffer, filename: string): Promise<Buffer> {
    try {
      console.log('🔄 Starting PDF to Word with official SDK...');
      console.log('   File:', filename, 'Size:', fileBuffer.length, 'bytes');

      const task = this.instance.newTask('pdfdocx');
      
      await task.addFile(fileBuffer, filename);
      
      console.log('   Processing...');
      await task.process();
      
      console.log('   Downloading...');
      const resultBuffer = await task.download();
      
      console.log('✅ Conversion completed!');
      console.log('   Result size:', resultBuffer.length, 'bytes');
      
      return resultBuffer;
    } catch (error: any) {
      console.error('❌ Official SDK PDF to Word error:', error.message);
      throw error;
    }
  }
}

// Singleton instance
let officialClientInstance: OfficialILovePDFClient | null = null;

export function getOfficialClient(): OfficialILovePDFClient {
  if (!officialClientInstance) {
    const publicKey = process.env.ILOVEPDF_PUBLIC_KEY;
    const secretKey = process.env.ILOVEPDF_SECRET_KEY;
    
    if (!publicKey || !secretKey) {
      throw new Error('iLovePDF API keys not configured');
    }
    
    officialClientInstance = new OfficialILovePDFClient(publicKey, secretKey);
  }
  
  return officialClientInstance;
}
