import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const PORT = process.env.PORT || 5001;
  const app = await NestFactory.create(AppModule, { cors: true });
  // app.use(
  //   helmet({
  //     crossOriginResourcePolicy: true,
  //   }),
  // );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(PORT, () => console.log(`Server start on PORT = ${PORT}`));
}
bootstrap();
