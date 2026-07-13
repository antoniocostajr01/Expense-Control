using ExpenseControl.Api.Data;
using ExpenseControl.Api.Dtos;
using ExpenseControl.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Controllers;

[ApiController]
[Route("transactions")]
public class TransactionsController : ControllerBase
{
    private const int AgeOfMajority = 18;

    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionResponse>>> GetAll()
    {
        var transactions = await _context.Transactions
            .Select(t => new TransactionResponse(t.Id, t.Description, t.Amount, t.Type, t.PersonId))
            .ToListAsync();

        return Ok(transactions);
    }

    [HttpPost]
    public async Task<ActionResult<TransactionResponse>> Create(CreateTransactionRequest request)
    {
        var person = await _context.People.FindAsync(request.PersonId!.Value);
        if (person is null)
        {
            return NotFound(new { message = $"Pessoa {request.PersonId} não encontrada." });
        }

        if (person.Age < AgeOfMajority && request.Type == TransactionType.Income)
        {
            return BadRequest(new { message = "Pessoa menor de 18 anos só pode registrar despesas (Expense)." });
        }

        if (request.Amount!.Value <= 0)
        {
            return BadRequest(new { message = "O valor deve ser maior que zero." });
        }

        var transaction = new Transaction
        {
            Description = request.Description,
            Amount = request.Amount.Value,
            Type = request.Type!.Value,
            PersonId = request.PersonId.Value
        };

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        var response = new TransactionResponse(
            transaction.Id,
            transaction.Description,
            transaction.Amount,
            transaction.Type,
            transaction.PersonId);

        return Created($"/transactions/{transaction.Id}", response);
    }
}
