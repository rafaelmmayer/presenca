import { z } from 'zod';
import { publicProcedure, router } from '.';
import { db } from '../../db';
import _ from 'lodash'

export const appRouter = router({
    getClasses: publicProcedure
        .query(() => {
            return db.class.findMany({
                include: {
                    times: true
                }
            });
        }),

    getClassesSchedule: publicProcedure
        .query(async () => {
            const res = await db.class.findMany({
                where: {
                    isActive: true,
                },
                include: {
                    times: true
                }
            })

            const cls: [{
                name: string,
                absences: number,
                total: number,
                dayOfWeek: number,
                start: string,
                end: string
            }?] = []

            res.forEach(c => {
                c.times.forEach(t => {
                    cls.push({
                        name: c.name,
                        absences: c.absences,
                        total: c.total,
                        dayOfWeek: t.dayOfWeek,
                        start: t.start,
                        end: t.end
                    })
                })
            })

            return _
                .chain(cls)
                .groupBy((cl) => cl?.dayOfWeek)

        }),

    createClass: publicProcedure
        .input(z.object({
            name: z.string(),
            absences: z.number().gte(0).optional(),
            total: z.number().gte(0).optional(),
            isActive: z.boolean().optional(),
            times: z.array(
                z.object({
                    dayOfWeek: z.number().gte(0).lte(6),
                    start: z.string().regex(/^(?:\d|[01]\d|2[0-3]):[0-5]\d$/),
                    end: z.string().regex(/^(?:\d|[01]\d|2[0-3]):[0-5]\d$/),
                })
            ).optional()
        }))
        .mutation(async ({ input }) => {
            const c = await db.class.create({
                data: {
                    name: input.name,
                    absences: input.absences ?? 0,
                    total: input.total ?? 0,
                    isActive: input.isActive ?? true
                },
                include: {
                    times: true
                },
            })

            if (input.times) {
                c.times = await db.classTime.createManyAndReturn({
                    data: input.times.map(t => {
                        return {
                            ...t,
                            classId: c.id
                        }
                    })
                })
            }

            return c
        })
});

export type AppRouter = typeof appRouter;
