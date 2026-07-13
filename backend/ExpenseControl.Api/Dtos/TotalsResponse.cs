namespace ExpenseControl.Api.Dtos;

public record TotalsResponse(
    IEnumerable<PersonTotals> People,
    OverallTotals Overall);

public record PersonTotals(
    int PersonId,
    string Name,
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance);

public record OverallTotals(
    decimal TotalIncome,
    decimal TotalExpense,
    decimal Balance);
