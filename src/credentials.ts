export function validateCredentials() {
  const accessKeyId =
    process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY;
  if (!accessKeyId) {
    throw new Error(
      'AWS_ACCESS_KEY was not found in the environment variables and it is required to sign the request'
    );
  }

  const secretAccessKey =
    process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY;
  if (!accessKeyId) {
    throw new Error(
      'AWS_SECRET_KEY was not found in the environment variables and it is required to sign the request'
    );
  }

  const sessionToken = process.env.AWS_SESSION_TOKEN;
  if (!accessKeyId) {
    throw new Error(
      'AWS_SESSION_TOKEN was not found in the environment variables and it is required to sign the request'
    );
  }
}
