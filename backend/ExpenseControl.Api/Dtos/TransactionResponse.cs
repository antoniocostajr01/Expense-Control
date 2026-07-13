using ExpenseControl.Api.Models;

namespace ExpenseControl.Api.Dtos;

public record TransactionResponse(
    int Id,
    string Description,
    decimal Amount,
    TransactionType Type,
    int PersonId);
