import { useState } from 'react';
import './App.css'

const people = [ 
    {"id": 1, "name": "John", "age": 25, "city": "New York"},
{"id": 2, "name": "Alice", "age": 30, "city": "San Francisco"},
{"id": 3, "name": "Bob", "age": 28, "city": "Los Angeles"},
{"id": 4, "name": "Emily", "age": 22, "city": "Chicago"},
{"id": 5, "name": "Michael", "age": 35, "city": "Seattle"},
{"id": 6, "name": "Sophia", "age": 27, "city": "Boston"},
{"id": 7, "name": "David", "age": 31, "city": "Miami"},
{"id": 8, "name": "Olivia", "age": 26, "city": "Austin"},
{"id": 9, "name": "Daniel", "age": 29, "city": "Denver"},
{"id": 10, "name": "Ella", "age": 24, "city": "Portland"}
]



function App() {

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
  
    const handleSearch = (e) => {
      setSearchTerm(e.target.value);
    };
  
    const handleSort = (e) => {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
  

    const filteredPeople = people.filter((person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPeople = filteredPeople.sort((a, b) => {
      if (a.name < b.name) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a.name > b.name) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

  
    return (
      <div className="container">
        <h1>People</h1>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <table>
          <thead>
            <tr>
              <th onClick={handleSort}>Name</th>
              <th onClick={handleSort}>Age</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {sortedPeople.map((person) => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>{person.age}</td>
                <td>{person.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );



}

export default App
