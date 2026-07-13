using ExpenseControl.Api.Data;
using ExpenseControl.Api.Dtos;
using ExpenseControl.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Controllers;

[ApiController]
[Route("totals")]
public class TotalsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TotalsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<TotalsResponse>> GetTotals()
    {
        var people = await _context.People
            .Include(p => p.Transactions)
            .ToListAsync();

        var peopleTotals = people
            .Select(p =>
            {
                var totalIncome = p.Transactions
                    .Where(t => t.Type == TransactionType.Income)
                    .Sum(t => t.Amount);

                var totalExpense = p.Transactions
                    .Where(t => t.Type == TransactionType.Expense)
                    .Sum(t => t.Amount);

                return new PersonTotals(
                    p.Id,
                    p.Name,
                    totalIncome,
                    totalExpense,
                    totalIncome - totalExpense);
            })
            .ToList();

        var overall = new OverallTotals(
            peopleTotals.Sum(p => p.TotalIncome),
            peopleTotals.Sum(p => p.TotalExpense),
            peopleTotals.Sum(p => p.Balance));

        return Ok(new TotalsResponse(peopleTotals, overall));
    }
}
