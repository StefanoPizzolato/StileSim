import {GuppyColor, GuppySize, TurnState} from './enums.js';
import {Guppy} from './guppy.js';
import { Predator } from './predator.js';


var config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'phaser-container',
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    dom: {
        createContainer: true 
    }
};

var game = new Phaser.Game(config);


function preload ()
{
    this.load.image('guppy_bright','assets/guppy_coloured_256.png');
    this.load.image('guppy_dull','assets/guppy_dull_256.png');
    this.load.image('predator','assets/predator_256.png');
    this.load.image('bg_sea','assets/bg_sea_768.png');
    this.load.image('bg_sea_algae','assets/bg_sea_algae_768.png');
}


function create() 
{
    this.guppies = [];
    this.initGuppies = 20;
    this.initBrightDistribution = 0.5;
    this.initBigDistribution = 0.5;
    this.currentTurn = TurnState.Env; //the player has control
    this.UIEnabled = true;
    this.predators_n = 1;
    this.vegetation_n = 2;
    this.predatorsMax = 5;
    this.vegetationMax = 2;

    this.add.image(0,0,'bg_sea').setOrigin(0,0);
    this.add.image(768,0,'bg_sea').setOrigin(0,0);
   
    for(var i=0;i<this.initGuppies;i++){
        const color = Math.random() < this.initBrightDistribution ? GuppyColor.Bright : GuppyColor.Dull;
        const size = Math.random() < this.initBigDistribution ? GuppySize.Big : GuppySize.Small;
        const x = Phaser.Math.Between(200,800);
        const y = Phaser.Math.Between(100,600);

        var guppy = new Guppy(this,x,y,color,size);
        this.guppies.push(guppy);
    }

    this.vegetation = this.add.image(128,0,'bg_sea_algae').setOrigin(0,0).setDepth(2);

    drawUI(this);
   // disableUI(this);
}

//////
/*
small guppies: they are slow, but hide better in high vegetation
big guppies: they are faster and are spotted more in high vegetation
dull guppies: they can hide better in high veg, but they are less likely to find a mate
bright guppies: they can be spotted more if vegetation is high, they can find a mate more likely

We can control predators number and vegetation
*/


///////
/// STATE MACHINE
// TURNS:
// Environmental changes: the user can decide what the params are
// Predators arrive: each guppy, depending on properties and env, will have a chance of surviving the predator
// Mating: for simplicity, we can just have a single guppy produce another guppy WITH VARIANCE

function nextTurnState(scene){
    switch(scene.currentTurn){
        case TurnState.Env:
            scene.UIEnabled = false;
            //disableUI();
            scene.currentTurn=TurnState.Predators;
            predatorsTurn(scene);
            break;
        case TurnState.Predators:
            scene.UIEnabled = false;
            //disableUI();
            scene.currentTurn=TurnState.Mating;
            matingTurn(scene);
            break;
        case TurnState.Mating:
            scene.UIEnabled = true;
            //enableUI();
            scene.currentTurn=TurnState.Env;
            break;
    }
}

////
////////////



function predatorsTurn(scene){
    const predators = [];
    for(let i=0;i<parseInt(scene.predators_n);i++){
        const predator = new Predator(scene); //this will spawn the predators
        predators.push(predator); 
    }

    scene.time.delayedCall(2000, () => {
        for(let i=0;i<predators.length;i++){
            scene.guppies.forEach(g=>g.survive());
            scene.guppies = scene.guppies.filter(g => g.active);
        }
    });

    scene.time.delayedCall(4000, () => {
        predators.forEach(p=>p.destroy());
        nextTurnState(scene);
    });

    

}

function matingTurn(scene){
    //
    scene.time.delayedCall(1000, () => {
        scene.guppies.forEach(g=>g.reproduce());
    });

    scene.time.delayedCall(2000, () => {
        nextTurnState(scene);
    });
    
}



/////////
// UI

function drawUI(scene){
    //predators slider
    const predatorSlider = document.createElement('input');
    predatorSlider.type = 'range';
    predatorSlider.min = '0';
    predatorSlider.max = scene.predatorsMax;
    predatorSlider.value = scene.predators_n;
    predatorSlider.style.width = '200px'; // Optional styling

    // Add listener for value changes
    predatorSlider.addEventListener('input', () => {
        scene.predators_n = parseInt(predatorSlider.value);
        // Use input.value for game logic
    });

    // Create a Phaser DOMElement from it
    scene.predatorSlider = scene.add.dom(150, 720, predatorSlider);

    //vegetation slider
    const vegetationSlider = document.createElement('input');
    vegetationSlider.type = 'range';
    vegetationSlider.min = '0';
    vegetationSlider.max = scene.vegetationMax;
    vegetationSlider.value = scene.vegetation_n;
    vegetationSlider.style.width = '200px'; // Optional styling

    // Add listener for value changes
    vegetationSlider.addEventListener('input', () => {
        scene.vegetation_n = parseInt(vegetationSlider.value);
        setVegetationAlpha(scene, parseInt(vegetationSlider.value)/parseInt(vegetationSlider.max));
        // Use input.value for game logic
    });

    // Create a Phaser DOMElement from it
    scene.vegetationSlider = scene.add.dom(450, 720, vegetationSlider);

    // ADD ACTION BUTTON
    scene.btnResume = scene.add.text(650, 720, 'Action', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    scene.btnResume.setInteractive();
    scene.btnResume.on('pointerup', function(){
        if(scene.currentTurn==TurnState.Env)
            nextTurnState(scene);
    });

    scene.add.text(150, 690, 'Predators', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);
    scene.add.text(450, 690, 'Vegetation', { fontSize: '20px', fill: '#fff' }).setOrigin(0.5);

}

function setVegetationAlpha(scene,alpha){
    if(scene.vegetation==null)
        return;
    if(alpha>1 || alpha<0)
        return;

    scene.vegetation.alpha = alpha;
    return alpha;
}

/* TODO: Doesn't work
function enableUI(scene){
    scene.vegetationSlider.disabled = false;
}

function disableUI(scene){
    scene.vegetationSlider.disabled = true;
}*/


function update ()
{


    // TODO: DISABLE SLIDERS WHEN IT's NOT ENV TURN

    
    //clean the guppies array from null references
    this.guppies.forEach(g => g.update());
    
    
}