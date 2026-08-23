/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Включаем статический экспорт[reference:2][reference:3]
  images: {
    unoptimized: true,  // Отключаем оптимизацию изображений для статики[reference:4]
  },
  // Если сайт будет лежать в подпапке репозитория (https://kivanort.github.io/NavIIgator/)
  // раскомментируй следующую строку и укажи название репозитория:
  // basePath: '/NavIIgator',
};

export default nextConfig;