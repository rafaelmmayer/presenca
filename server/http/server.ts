import {
    fastifyTRPCPlugin,
    FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { createContext } from './trcp/context';
import { appRouter, type AppRouter } from './trcp/router';
import { updateTotalClasses } from "../crons/update-total-classes";
import { schedule } from 'node-cron'

const app = fastify({
    maxParamLength: 5000,
    logger: true
})

app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
        router: appRouter,
        createContext,
        onError({ path, error }) {
            // report to error monitoring
            console.error(`Error in tRPC handler on path '${path}':`, error);
        },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
});

app.get('/', (req, rep) => {
    return { hello: 'world' }
})



app.listen({ port: 3333 })
    .then(() => {
        schedule('* * * * *', async () => {
            await updateTotalClasses(app.log)
        })
    })
    .catch((err) => {
        app.log.error(err)
        process.exit(1)
    })

