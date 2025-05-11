// app/api/upload/route.js
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Processes multipart form data file uploads
 */
async function processFormData(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return { error: 'No file uploaded' };
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' };
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { error: 'File size exceeds the 5MB limit.' };
    }

    // Create unique filename
    const uniqueId = uuidv4();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uniqueId}.${fileExtension}`;
    
    // Create path to uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Create the uploads directory if it doesn't exist
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }
    
    // Create file path
    const filePath = path.join(uploadsDir, fileName);
    
    // Write the file to the uploads directory
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Return the relative path to be stored in the database
    return { 
      success: true,
      filePath: `/uploads/${fileName}` 
    };
  } catch (error) {
    console.error('Error processing upload:', error);
    return { error: 'Error uploading file' };
  }
}

/**
 * POST handler for file uploads
 */
export async function POST(request) {
  const result = await processFormData(request);
  
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  
  return NextResponse.json({ 
    filePath: result.filePath 
  });
}