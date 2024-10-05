import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';

// Disable Next.js' default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        res.status(500).json({ error: 'Failed to parse form data' });
        return;
      }

      // Handle the filename correctly
      const filename = Array.isArray(fields.filename) ? fields.filename[0] : fields.filename;
      const file = Array.isArray(files.file) ? files.file[0] : files.file;

      // Log for debugging
      console.log('Fields:', fields);
      console.log('Files:', files);

      if (!filename || typeof filename !== 'string') {
        res.status(400).json({ error: 'Invalid or missing filename' });
        return;
      }

      const firstName = filename.split(' ')[0].toLowerCase(); // Get first name in lowercase
      const uploadDir = path.join(process.cwd(), 'public/assets/images');
      await fs.mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, `dr-${firstName}.jpg`);
      console.log('Saving file to:', filePath); // Debug the file-saving path

      try {
        // Move and rename the uploaded file
        await fs.rename(file.filepath, filePath);
        res.status(200).json({ message: 'File uploaded successfully', filePath });
      } catch (error) {
        console.error("Error saving file:", error);
        res.status(500).json({ error: 'Failed to save the file' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
