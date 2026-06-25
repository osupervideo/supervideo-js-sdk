import fs from 'fs';
import { minify } from 'terser';

async function build() {
  // Garante que o diretorio dist exista
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // Le o arquivo fonte
  const code = fs.readFileSync('src/supervideo.js', 'utf8');

  // Copia o arquivo fonte para a pasta dist (versao de desenvolvimento)
  fs.writeFileSync('dist/supervideo.js', code);
  console.log('Gerado: dist/supervideo.js');

  // Minifica o codigo usando terser
  const minified = await minify(code, {
    compress: true,
    mangle: true
  });

  // Salva o codigo minificado na pasta dist
  fs.writeFileSync('dist/supervideo.min.js', minified.code);
  console.log('Gerado: dist/supervideo.min.js');

  console.log('Build finalizada com sucesso.');
}

build().catch((err) => {
  console.error('Erro na build:', err);
  process.exit(1);
});
