using System.ComponentModel.DataAnnotations;
using ExpenseControl.Api.Models;

namespace ExpenseControl.Api.Dtos;

public record CreateTransactionRequest
{
    [Required(ErrorMessage = "A descrição é obrigatória.")]
    public string Description { get; init; } = string.Empty;

    [Required(ErrorMessage = "O valor é obrigatório.")]
    public decimal? Amount { get; init; }

    [Required(ErrorMessage = "O tipo é obrigatório (Expense ou Income).")]
    public TransactionType? Type { get; init; }

    [Required(ErrorMessage = "A pessoa (personId) é obrigatória.")]
    public int? PersonId { get; init; }
}
