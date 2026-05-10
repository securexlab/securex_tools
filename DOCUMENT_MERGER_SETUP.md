# Universal Document Merger - Setup Guide

## 📦 Required npm Packages

Install these packages if you don't already have them:

```bash
npm install formidable
npm install axios  # If not already installed
```

**Package versions:**
- `formidable`: ^3.x (for parsing multipart/form-data)
- `axios`: ^1.x (for making HTTP requests to Cloudmersive)

## 🔧 Setup Instructions

### 1. Environment Variables
Ensure your `.env.local` file includes:

```
CLOUDMERSIVE_API_KEY=cf7ca13d-323c-4db7-8d5f-176694665c7e
```

### 2. File Structure
Your project structure should look like:

```
src/pages/
├── file-merger.jsx          (Frontend UI)
├── api/
│   └── merge.js             (Backend API)
```

### 3. Add Route to Your Navigation (if applicable)

In your app's navigation/routing, add a link to `/file-merger`:

```jsx
// Example in your navigation component
<Link href="/file-merger">
  <a>Document Merger</a>
</Link>
```

## 🔄 How It Works

### Frontend (`file-merger.jsx`)

1. **Multi-file upload** with drag-and-drop support
2. **File validation:**
   - Accepts: `.pdf`, `.docx`, `.doc`, `.pptx`, `.ppt`
   - Max file size: 50 MB per file
   - Min files: 2 files required

3. **File queue management:**
   - Display all uploaded files with size info
   - Remove individual files before merging
   - Shows error if < 2 files

4. **Upload handling:**
   - Sends `FormData` with all files to `/api/merge`
   - Shows loading spinner during merge
   - Auto-downloads the resulting PDF
   - Shows success message after download

### Backend (`pages/api/merge.js`)

1. **Receive files:** Parses `multipart/form-data` using `formidable`

2. **Process each file:**
   - **If already PDF:** Read buffer directly
   - **If DOCX/PPT:** Call Cloudmersive's Auto-Detect to PDF endpoint
   - Store all as PDF buffers

3. **Merge PDFs:** Use Cloudmersive's Merge Multiple PDFs endpoint

4. **Return file:** Stream merged PDF to frontend with download headers

## 🌐 Cloudmersive API Endpoints Used

### 1. Auto-Detect to PDF
```
POST https://api.cloudmersive.com/convert/autodetect/to/pdf
```
- Converts any supported document format to PDF
- Used for: `.docx`, `.doc`, `.pptx`, `.ppt` files

### 2. Merge Multiple PDFs
```
POST https://api.cloudmersive.com/convert/merge/pdf/multi
```
- Merges multiple PDF files into one
- Input: Multiple PDF files
- Output: Single merged PDF

## ⚙️ API Response Handling

### Success Response
- **Status:** 200
- **Content-Type:** `application/pdf`
- **Body:** Binary PDF file buffer
- Browser automatically downloads as `merged-{timestamp}.pdf`

### Error Responses
- **400:** Bad request (< 2 files, invalid format)
- **401:** Invalid API key
- **429:** Rate limited
- **500:** Server error

All errors return JSON with:
```json
{
  "error": "User-friendly error message",
  "details": "Technical error details"
}
```

## 🚀 Deployment Checklist

- [ ] Install required packages: `npm install formidable axios`
- [ ] Set `CLOUDMERSIVE_API_KEY` in Vercel/hosting environment variables
- [ ] Test file merger locally: `npm run dev`
- [ ] Test with various file types (PDF, DOCX, PPTX)
- [ ] Test with multiple files (2+)
- [ ] Verify download functionality
- [ ] Check error handling (invalid key, oversized files, etc.)

## 🐛 Troubleshooting

### "API key not configured"
- Ensure `CLOUDMERSIVE_API_KEY` is set in your environment variables
- For local development, add to `.env.local`
- For production (Vercel), add to project settings → Environment Variables

### "Request timeout"
- Files may be too large (max 50 MB per file)
- Cloudmersive API may be slow; increase timeout if needed
- Current timeout: 60 seconds per API call

### "Failed to merge documents"
- Check that files are valid (use a file validator tool)
- Ensure file extensions match actual format
- Check Cloudmersive API status

### Files not uploading
- Check file size (max 50 MB per file)
- Verify file format is supported
- Check browser console for specific error message

## 🎨 UI Customization

The component uses Tailwind CSS with:
- **Primary color:** `blue-600` (accents and buttons)
- **Background:** `slate` (light: `slate-50`, dark: `slate-900`)
- **Borders:** Subtle `border-slate-200` or `border-slate-800`
- **Rounded corners:** `rounded-3xl` (premium feel)
- **Shadows:** `shadow-lg` with blue tint on buttons

To customize colors, find and replace:
- `blue-600` → Your primary color
- `slate-*` → Your preferred background/border color

## 📝 Code Features

### Frontend
- ✅ Drag-and-drop zone
- ✅ Multiple file selection
- ✅ File validation with error messages
- ✅ File queue with remove functionality
- ✅ Loading state with spinner
- ✅ Success message
- ✅ Automatic PDF download
- ✅ Responsive design (mobile-friendly)
- ✅ Dark mode support

### Backend
- ✅ Multipart form data parsing
- ✅ File size validation (50 MB limit)
- ✅ Automatic format detection & conversion
- ✅ PDF merging
- ✅ Comprehensive error handling
- ✅ Logging for debugging
- ✅ API key validation
- ✅ Timeout handling (60 seconds)

## 🔐 Security Notes

1. **API Key:** Never commit `.env.local` to version control
2. **File Validation:** Backend validates file count and size
3. **MIME Type Check:** Frontend checks extensions and MIME types
4. **API Timeout:** 60-second timeout prevents hanging requests
5. **Error Messages:** Sensitive details not exposed to frontend

## 📊 Performance Considerations

- **Max file size:** 50 MB per file (configurable in formidable)
- **Max files per request:** Unlimited (practical limit ~10-15 files)
- **Processing time:** Depends on file sizes and Cloudmersive API response
- **Typical merge time:** 5-30 seconds for 2-5 average documents

For very large merges (20+ MB total), consider:
1. Increasing timeout in axios config
2. Implementing progress tracking
3. Adding a queue system for large batches

## 🆘 Support

For Cloudmersive API issues:
- Docs: https://cloudmersive.com/documentation/overview
- API Status: Check Cloudmersive dashboard

For Next.js/Vercel issues:
- Check vercel.json configuration
- Ensure API route is properly configured
- Check Vercel logs for error details
