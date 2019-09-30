import React from 'react';
import { Button, TextField } from '@material-ui/core';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView : "three",
            phiLength : Math.PI,

        };
    }

    switchView = () => {
        this.state.currentView === "three" ? this.setState({ currentView : "aframe"}) : this.setState({ currentView : "three" });
    }

    threeControls = () => {
        return (
            <div>
                <TextField 
                    label="Phi Length (in degrees)"
                    value={this.state.phiLength}
                    type="number" 
                    ref="phiLengthInput"
                    onChange={() => { this.setState({ phiLength : this.refs.phiLengthInput.getValue() }) }}>    
                </TextField>
            </div>
            
        );
    }

    render() {
        return (
             <div>
                 <Button onClick={this.switchView()}>Switch View</Button>
             </div>
        );
    }
}

export default App;