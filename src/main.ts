import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { Transport } from '@nestjs/common/enums/transport.enum';
import { CronJob } from 'cron';
import { ConfigStaticService } from './provider/config/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { AnjukeService } from './service/anjuke.service';

async function bootstrap() {

    /**
     * 启动服务
     */

    const app = await NestFactory.create(AppModule, {
        cors: false,
        bodyParser: true,
    });
    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: ConfigStaticService.get('AMQP_URL'),
            queue: ConfigStaticService.get('AMQP_QUEUE'),
            queueOptions: { durable: true },
            prefetchCount: 5,
        },
    });

    app.use((req, res, next) => {
        Logger.log(req.url);
        next();
    });

    /**
     * 文档服务
     */
    if (process.env.NODE_ENV === 'dev') {
        const options = new DocumentBuilder()
            .setTitle('租房数据中心 [内部文档]')
            .setDescription('抓取并处理租房数据')
            .setVersion('1.0')
            .setBasePath('/')
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('docs', app, document);
    } else {
        const options = new DocumentBuilder()
            .setTitle('租房数据中心')
            .setDescription('抓取并处理租房数据')
            .setVersion('1.0')
            .setBasePath('/rent_house')
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('docs', app, document);
    }

    /**
     * 定时计划
     */

    const anjukeService = app.get(AnjukeService);
    new CronJob(ConfigStaticService.get('CRON'), async () => {
        await anjukeService.bulkUpsert();
    }, undefined, true, 'Asia/Shanghai');

    /**
     * 启动
     */

    await app.startAllMicroservicesAsync();
    await app.listenAsync(ConfigStaticService.PORT);

}

bootstrap();
