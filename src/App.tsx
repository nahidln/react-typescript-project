import React, {ChangeEvent, FormEvent, MouseEventHandler, useEffect, useState} from 'react';
import axios from 'axios';
import {IProductContract} from './contracts/ProductContracts';
import './App.css'

function App() {
  const [category, setCategory] = useState<string[]>([]);
  const [products, setProducts] = useState<IProductContract[]>([]);
  const [cartCount, SetCartCount] = useState<number>(0);
  const [cartItems, setCartCartItems] = useState<IProductContract[]>([]);
  const [cartTotalPrice, setCartTotalPrice] = useState<number>(0)

  const LoadCategories=():void=>{
    axios.get('http://fakestoreapi.com/products/categories')
    .then(res=>{
      res.data.unshift("All");
      setCategory(res.data)
    })
  }

  const LoadProducts=(url:string):void=>{
    axios.get(url)
    .then(res=>{
      setProducts(res.data)
    })
  }

  useEffect(()=>{
    LoadCategories();
    LoadProducts('http://fakestoreapi.com/products');
  },[])

  const handleCategoryChange =(event: ChangeEvent<HTMLSelectElement>)=>{
    if(event.target.value=="All"){
      LoadProducts('http://fakestoreapi.com/products');
    }else{
      LoadProducts(`http://fakestoreapi.com/products/category/${event.target.value}`);
    }
  }

  const handleAddtoCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    bindCartItems(parseInt(event.currentTarget.value))
  };

  const bindCartItems =(productId:number)=>{
    axios.get(`http://fakestoreapi.com/products/${productId}`)
    .then(response=>{
      setCartCartItems([...cartItems,response.data])
      getCartCount();
     handleCartTotal();
    });     
  }

  useEffect(()=>{
    handleCartTotal();
    getCartCount();
  },[cartItems])

  const getCartCount = ()=>{
    SetCartCount(cartItems.length);
  }

  const handleCartTotal = ()=>{
    const total = cartItems.reduce((initvalue:number,currentValue):number=>{
       return initvalue + currentValue.price;
    },0)
    setCartTotalPrice(total)
  }

  const handleRemoveItem=(event: React.MouseEvent<HTMLSpanElement>)=>{
    //console.log(event.currentTarget.id)
    cartItems.splice(parseInt(event.currentTarget.id),1);
    handleCartTotal();
    getCartCount();
  }

  return (
    <div className='container-fluid'>
      <header className='bg-danger text-white p-3 d-flex justify-content-between mb-2'>
        <div className='h4'>
          <span className='bi bi-house-door-fill me-2'></span>
          Shopping App
        </div>
        <div style={{color:"#feff9e", fontSize:"28px"}} className='me-3'>
          <span className='bi bi-person-circle'></span>
          <span className='bi bi-basket2-fill ms-2'></span>
          <span className='badge' id="counter">{cartCount}</span>
        </div>
      </header>
      <div className='row mx-1' style={{backgroundColor:"#FFEDDC"}}>
        <nav className='col-2 pt-2'>
          <h5 className='text-success'>Select Category:</h5>
          <select className='form-select' onChange={handleCategoryChange} style={{width:"180px"}}>
            {
              category.map((item,index)=><option key={index} value={item}>{item}</option>)              
            }
          </select>
        </nav>
        <main className="col-7 d-flex flex-wrap overflow-auto justify-content-between" style={{height:'650px', width:"720px"}}>          
          {
            products.map((product)=>
            <div className='card m-2 p-2' style={{width:"210px"}} key={product.id}>
             <div className='card-header'><img src={product.image} height="140" className='card-img-top p-1' /></div>
            <div className='card-body'>
            {product.title.substring(0,30).concat("...")}
            </div>
            <div className='card-footer'>
              <button className='btn btn-danger w-100'  value={product.id} onClick={handleAddtoCart}>
                <span className='bi bi-cart4'></span>Add To Cart
              </button>
            </div>
           </div>
            )
          }          
        </main>
        <aside className='col-3 mt-2'>
          <h4 className='text-success text-center mb-4'>Your Cart Products</h4>
          <table className='table table-hover border border-1' style={{width:"350px"}}>
            <thead>
              <tr>
              <th>Preview</th><th>Title</th><th>Qty</th><th>Price</th><th>Actions</th>
              </tr>
              </thead>
              <tbody>
              {
                cartItems.map((cartItem,index)=>
                  <tr key={index}>
                    <td><img src={cartItem.image} width="70px" height="70px" /></td>
                    <td>{cartItem.title.substring(0,28).concat('...')}</td>
                    <td>1</td>
                    <td>${cartItem.price}</td>
                    <td>
                     <span className="bi bi-trash-fill text-danger" id={index.toString()} onClick={handleRemoveItem}></span>
                    </td>
                  </tr>
                  )
              }
              </tbody>
             <tfoot>
              <tr>
                <td colSpan={3} className='text-end pe-2 text-danger h5'>Total:</td>
                <td colSpan={2}>${cartTotalPrice}</td>
              </tr>
             </tfoot>            
          </table>
        </aside>
      </div>
    </div>
  );
}

export default App;
