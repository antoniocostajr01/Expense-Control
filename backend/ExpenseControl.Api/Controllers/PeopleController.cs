using ExpenseControl.Api.Data;
using ExpenseControl.Api.Dtos;
using ExpenseControl.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseControl.Api.Controllers;

[ApiController]
[Route("people")]
public class PeopleController : ControllerBase
{
    private readonly AppDbContext _context; //persistencia

    public PeopleController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PersonResponse>>> GetAll()
    {
        var people = await _context.People
            .Select(p => new PersonResponse(p.Id, p.Name, p.Age))
            .ToListAsync();

        return Ok(people);
    }

    [HttpPost]
    public async Task<ActionResult<PersonResponse>> Create(CreatePersonRequest request)
    {
        var person = new Person
        {
            Name = request.Name,
            Age = request.Age
        };

        _context.People.Add(person);
        await _context.SaveChangesAsync();

        var response = new PersonResponse(person.Id, person.Name, person.Age);

        return Created($"/people/{person.Id}", response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var person = await _context.People.FindAsync(id);

        if (person is null)
        {
            return NotFound();
        }

        _context.People.Remove(person);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
