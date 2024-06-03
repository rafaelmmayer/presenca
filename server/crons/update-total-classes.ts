import { db } from "../db";
import { getDayOfWeek } from "../lib/dates";
import { FastifyBaseLogger } from "fastify";

export const updateTotalClasses = async (log: FastifyBaseLogger) => {

    const dayOfWeek = getDayOfWeek()

    log.info({ dayOfWeek }, 'atualizando aulas')

    const cs = await db.class.findMany({
        where: {
            times: {
                some: {
                    dayOfWeek
                }
            }
        }
    })

    if (cs.length === 0) {
        log.info('nenhuma aula encontrada para atualizar')

        return
    }

    log.info({
        classes: cs.map(c => {
            return {
                id: c.id,
                name: c.name
            }
        })
    }, 'atualizando aulas')
}
