import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;
		if (path === '/api/upload' && method === 'POST') {
			const formData = await request.formData();
			const file = formData.get('pdfFile') as File;
			if (!file) return new Response('No file uploaded', { status: 400 });
			const filename = file.name + '-' + Date.now();
			const filetype = file.type;

			// Credentials
			const ACCOUNT_ID = env.ACCOUNT_ID;
			const ACCESS_KEY_ID = env.ACCESS_KEY_ID;
			const SECRET_ACCESS_KEY = env.SECRET_ACCESS_KEY;

			const S3 = new S3Client({
				region: 'auto',
				endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
				credentials: {
					accessKeyId: ACCESS_KEY_ID,
					secretAccessKey: SECRET_ACCESS_KEY,
				},
			});

			try {
				const url = 'https://' + ACCOUNT_ID + '.r2.cloudflarestorage.com/';

				// Generate pre-signed URL using @aws-sdk/s3-request-presigner
				const command = new PutObjectCommand({
					Bucket: env.BUCKET_NAME,
					Key: filename,
					ContentType: filetype,
					Metadata: {
						User: 'John Doe',
					},
				});

				const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600, unhoistableHeaders: new Set(['x-amz-meta-user']) });

				// Upload file to R2
				const upload = await fetch(signedUrl, {
					method: 'PUT',
					body: file,
					headers: {
						'Content-Type': filetype,
						'x-amz-meta-user': 'John Doe',
					},
				});

				console.log(upload);

				if (upload.status !== 200) {
					return new Response(JSON.stringify({ error: 'Upload failed' }), { status: 500 });
				}

				return new Response(JSON.stringify({ message: 'Uploaded' }), { status: 200 });
			} catch (error) {
				console.error(error);
				return new Response(JSON.stringify({ error }), { status: 500 });
			}
		}
		return new Response('Hello World!');
	},
} satisfies ExportedHandler<Env>;
