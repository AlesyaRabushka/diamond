import React, { ChangeEvent, HTMLAttributeAnchorTarget, useState } from 'react';
import './App.css';
import { FormComponent } from './components/formComponent';

function App() {

  const [file, setFile] = useState(null);


  return (
    <div className="App">
      <FormComponent/>
    </div>
  );
}

export default App;
