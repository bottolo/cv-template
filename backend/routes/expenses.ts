import {Hono} from "hono";
import {zValidator} from "@hono/zod-validator";
import z from "zod";


const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    description: z.string(),
    amount: z.number()
})

const fakeExpenses: Expense[] = [
    {id: 1, description: "Groceries", amount: 100},
    {id: 2, description: "Rent", amount: 500},
    {id: 3, description: "Gas", amount: 30},
    {id: 4, description: "Eating out", amount: 150}
]

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({id: true})

export const expensesRoute = new Hono()
    .get("/", (c) => {
        return c.json({expenses: fakeExpenses});
    })
    .post("/", zValidator("json", createPostSchema), async (c) => {
        const expense = c.req.valid("json")

        fakeExpenses.push({...expense, id: fakeExpenses.length})
        return c.json(expense);
    })
    .get("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param("id"));

        const expense = fakeExpenses.find((expense) => expense.id === id)

        if (!expense) {
            return c.status(404)
        }

        return c.json(expense);
    })
    .get("/total-spent", (c) => {
        const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0)
        return c.json({total});
    })
    .delete("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param("id"));
        const index = fakeExpenses.findIndex((expense) => expense.id === id)
        if (index === -1) {
            return c.notFound()
        }

        const deletedExpense = fakeExpenses.splice(index, 1)[0]

        return c.json(deletedExpense);
    })
