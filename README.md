# R2 Pre-Signed URL Upload with Custom Metadata

This project demonstrates a Cloudflare Worker that handles file uploads to R2 storage using pre-signed URLs with custom metadata.

## Features

- Handles POST requests to `/api/upload` for file uploads
- Generates pre-signed URLs for secure file uploads to R2 storage
- Uses AWS SDK for S3 operations
- Includes metadata with uploads

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Configure environment variables:
- Rename `.dev.vars.example` to `.dev.vars`
- Add your R2 credentials in the file

## Usage

To start the development server, run:
1. Start the development server:
```bash
npm run dev
```
2. Update the metadata in [`src/index.ts`](src/index.ts)
3. Access the application at `http://localhost:8787`
4. Upload a file using the provided form
5. View uploaded files in the R2 storage with the custom metadata

To deploy to production, run:

```bash
npm run deploy
```

Add the R2 credentials to the deployed worker.

## Contributing

This project is open for contributions. Feel free to submit issues and pull requests.