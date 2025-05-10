import {GuppyColor, GuppySize} from './enums.js';

export class Predator extends Phaser.Physics.Arcade.Sprite {
    constructor(scene) {
        super(scene,0,0,'predator');

        this.y = Phaser.Math.Between(128, 600);
       
        console.log("CREATED PREDATOR");

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.speed = Phaser.Math.Between(200, 400);
        this.setFlip(true, false);
        

        // Optional: Configure physics properties
        //this.setCollideWorldBounds(true);
        //this.setBounce(1);
        //this.setDrag(100);
        this.setDepth(1);  // render order
        this.setVelocity(this.speed,0);
    }

    update() {

    }

}
