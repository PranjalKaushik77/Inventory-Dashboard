import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Extract the uploaded file from the form data
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Create a new FormData object to send to the Python backend
  const pythonFormData = new FormData();
  pythonFormData.append("file", file);

  try {
    // Forward the file to your Python FastAPI endpoint.
    // Update the URL if your backend is hosted elsewhere.
    const pythonResponse = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: pythonFormData,
    });

    if (!pythonResponse.ok) {
      const errorData = await pythonResponse.json();
      return NextResponse.json(
        { error: errorData.detail || "Error processing file" },
        { status: pythonResponse.status }
      );
    }

    const analysisResult = await pythonResponse.json();
    return NextResponse.json(analysisResult);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to forward the file to the backend" },
      { status: 500 }
    );
  }
}
