using API.Data;
using API.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace API.Repository
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly HotelContext _context;
        internal DbSet<T> dbSet;
        public Repository(HotelContext context)
        {
            _context = context;
            this.dbSet = _context.Set<T>();
        }
        public void Add(T entity)
        {
            dbSet.Add(entity);
        }

        public T Get(Expression<Func<T, bool>> filter)
        {
            IQueryable<T> query = dbSet;
            query = query.Where(filter);
            return query.FirstOrDefault();
        }

        public IEnumerable<T> GetAll()
        {

            IQueryable<T> query = dbSet;
            return query.ToList();
        }

        public void Remove(T entity)
        {
            dbSet.Remove(entity);
        }

        public void Update(T entity)
        {
            dbSet.Update(entity);
        }
    }
}
