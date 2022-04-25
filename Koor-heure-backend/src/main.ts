import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import { AppModule } from './app.module';
import { UsersModule } from './users/users.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('User exemple')
    .setDescription('The user API description')
    .setVersion('1.0')
    .addBearerAuth({
      type : 'http', scheme: 'bearer', bearerFormat: 'JWT'},'acces-token'
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document)
  await app.listen(3000);
}
bootstrap();
