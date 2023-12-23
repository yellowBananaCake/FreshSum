import {Route, Routes} from 'react-router-dom';

import {Login} from './components/Login';
import {Navbar} from './components/Navbar';
import {Registration} from './components/Registration';
import {Homepage} from './components/Homepage';
import {Dish} from './components/Dish'
import {Report} from './components/Report'
import { Product } from './components/Product';
import { DictDish } from './components/DictDish';

export function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path='/' element={<Homepage />} />

      <Route path='/login' element={<Login />} />
      <Route path='/registration' element={<Registration />} />
      <Route path='/dish' element={<Dish />} />
      <Route path='/report' element={<Report />} />

      <Route path='/product' element={<Product />} />
      <Route path='/dict_dish' element={<DictDish />} />
    </Routes>
    </>
  );

}

export default App;