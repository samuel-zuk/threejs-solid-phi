import React from 'react';
import { Button, TextField } from '@material-ui/core';
import AFrameScene from './AFrameScene';
import ThreeScene from './ThreeScene';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView : "three",
            phiLength : Math.PI,
            wireframe : true,
        };
    }

    switchView = () => {
        this.state.currentView === "three" ? this.setState({ currentView : "aframe"}) : this.setState({ currentView : "three" });
    }

    radToDeg = (rad) => {
        return rad * 180 / Math.PI;
    }

    degToRad = (deg) => {
        return deg * Math.PI / 180;
    }

    handleChange = (e) => {
        this.setState({ phiLength : this.degToRad(e.target.value) });
    }

    threeHelper = () => {
        return (
            <React.Fragment>
                <div>
                    <TextField 
                        label="Phi Length (in degrees)"
                        value={this.radToDeg(this.state.phiLength)}
                        type="number" 
                        ref="phiLengthInput"
                        onChange={this.handleChange} />
                    <Button onClick={() => { this.setState({ wireframe : !this.state.wireframe }) }}>
                        Toggle Wireframe
                    </Button>
                </div>
                <div>
                    <ThreeScene phiLength={this.state.phiLength} wireframe={this.state.wireframe} />
                </div>
            </React.Fragment>
        );
    }

    aFrameHelper = () => {
        return <AFrameScene />;
    }

    render() {
        return (   
            <div>
                <Button variant="outlined" onClick={this.switchView}>Switch View</Button>
                {this.state.currentView === "three" ?
                    this.threeHelper() :
                    this.aFrameHelper()
                }
                <Button variant="outlined" onClick={()=>{console.log(this.state)}}>debug</Button>
            </div>
        );
    }
}

export default App;