const { spawn } = require('child_process');

export function curl(args: string[]) {
  const child = spawn('curl', args);

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

  child.on('close', (code: any) => {
    process.exit(code);
  });
}
