import {useState, useEffect} from 'react';
import './App.css';

const URL = 'http://localhost/shoppinglist/'

function App() {
  
  const [items, setItems] = useState([]);
  const [oneitem, setOneitem] = useState('');
  const [quantity, setQuantity] = useState('');
  
  useEffect(() => {
    
    let status = 0;
    fetch(URL + 'index.php')
    .then(res => {
      status = parseInt(res.status);
      return res.json()
    })
    .then(
      (res) => {
      	if (status === 200) {
          setItems(res);
      	} else {
          alert(res.error);
      	}
      }, (error) => {
          alert(error); 
      }
    )
  }, [])

  function addItem(e) {
    if (oneitem === '' || quantity === '') {
      alert('Type Item and Amount!')
    } else {
      e.preventDefault();
      let status = 0;
      fetch(URL + 'add.php',{
        method: 'POST',
        headers: {
          'Accept': 'application.json',
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          description : oneitem,
          amount : quantity
        })
      })
      .then(res => {
        status = parseInt(res.status);
        return res.json()
      })
      .then(
        (res) => {
          if (status === 200) {
          setItems(items => [...items, res]);
          setOneitem('');
          setQuantity('');
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
    }   
  }
 
  function deleteItem(id) {
    let status = 0;
    fetch(URL + 'delete.php',{
      method: 'POST',
      headers: {
      	'Accept': 'application.json',
      	'Content-type': 'application/json',
      },
      body: JSON.stringify({
      	id: id
      })
    })
    .then(res => {
      status = parseInt(res.status);
      return res.json()
    })
    .then(
      (res) => {
      	if (status === 200) {
      	const newListWithoutRemoved = items.filter((item) => item.id !== id);
        setItems(newListWithoutRemoved);
    
      	} else {
          alert(res.error);
      	}
      }, (error) => {
      	alert(error);
      }
    )
  }

  return (
    <div className="container">
      <h3 className="col-12 mt-3 mb-4">Shopping list</h3>
      <form onSubmit={addItem}>
        <div className="row g-3 align-items-center">
          <div className="col-sm-12 col-md-2 col-lg-1" >
            <label htmlFor ="item" className="col-form-label">Item:</label>
          </div>
          <div className="col-sm-12 col-md-10 col-lg-3">
            <input type="text" id="item" placeholder="Type next item" className="form-control" aria-describedby="item" value={oneitem} onChange={e => setOneitem(e.target.value)} />
          </div>
          <div className="col-sm-12 col-md-2 col-lg-1">
            <label htmlFor="amount" className="col-form-label">Amount:</label>
          </div>
          <div className="col-sm-12 col-md-10 col-lg-3">
            <input type="number" id="amount" min="1" max="25" placeholder="Type amount of items" className="form-control" aria-describedby="amount" value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
          <div className="col-12 col-lg-2">
            <button type="submit" className= "btn btn-secondary">Add item</button>
          </div>
        </div>
      </form>
      <ol className="list-unstyled row mt-3">
        {items.map(item =>(
            <li className="col-12 mb-2 row" key={item.id}>
              <div className=" d-inline-block col-6 col-md-5 col-lg-4 col-xl-4">
                <div>{item.description}</div>
              </div>
              <div className=" d-inline-block col-3 col-lg-3 col-xl-3">
                <div >{item.amount}</div>
              </div>
              <div className=" d-inline-block col-3 col-lg-3 col-md-2 col-xl-3">
                <a onClick={() => deleteItem(item.id)} href=" # ">Delete</a>
              </div>
            </li>
        ))}
      </ol>   
    </div>
  );
}

export default App;
