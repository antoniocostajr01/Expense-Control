using System.ComponentModel.DataAnnotations;

namespace ExpenseControl.Api.Dtos;

public record CreatePersonRequest
{
    [Required(ErrorMessage = "O nome é obrigatório.")]
    public string Name { get; init; } = string.Empty;

    [Range(0, 120, ErrorMessage = "A idade deve estar entre 0 e 120.")]
    public int Age { get; init; }
}
