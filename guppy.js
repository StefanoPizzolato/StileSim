import {GuppyColor, GuppySize} from './enums.js';

export class Guppy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, color = GuppyColor.Dull, size = GuppySize.Small) {
        super(scene, x, y, color);
        //console.log(color+" "+size);

        // Add to scene and enable physics
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;

        //Custom properties
        this.size = size;
        this.color = color;
        this.survivalRate = 0.5;
        this.matingRate = 0.5;
        this.speed = 100;

        if(size==GuppySize.Big)
            this.speed = -Phaser.Math.Between(100, 200);
        else
            this.speed = -Phaser.Math.Between(20, 80);

        if(size===GuppySize.Big){
            this.setScale(0.5);
        }
        else{
            this.setScale(0.25);
        }
        

        // Optional: Configure physics properties
        this.setCollideWorldBounds(true);
        this.setBounce(1);
        //this.setDrag(100);
        this.setDepth(1);  // render order
        this.setVelocity(this.speed,0);
    }

    update() {
        if(this.body.velocity.x>0)
            this.setFlip(true, false);
        else
            this.setFlip(false, false);
        // Put movement or behavior logic here
    }

    survive(){
        let s = 0.7;

        // SURVIVAL RATES CALCULATIONS!
        if(this.color==GuppyColor.Dull){
            //if a guppy is dull colored in high vegetation it has more chance of survival
            //if dull colour and in low veg, same chance of survival
            s+=0.2*(this.scene.vegetation_n/this.scene.vegetationMax);
        }
        else{
            //if guppy is bright it is spotted more in high vegetation
            //in low vegetation same chance of survival
            s-=0.2*(this.scene.vegetation_n/this.scene.vegetationMax);
        }

        if(this.size==GuppySize.Big){
            //if guppy is big in high vegetation it can be spotted more
            //if big and low vegetation, it has more chance of escaping the predator (faster)
            s-=0.3*(this.scene.vegetation_n/this.scene.vegetationMax)-0.15;
        }
        else{
            // if small in high veg it camuflages
            //if small and no veg - no perks
            s+=0.2*(this.scene.vegetation_n/this.scene.vegetationMax);
        }

        let chance = Math.random();

        s = Phaser.Math.Clamp(s,0,1);
        console.log(this.color+" "+this.size+" "+chance+"/"+s);

        if(chance > s){ //out of luck!
            console.log("guppy survived\n");
            this.destroy();
        }
        else{
            console.log("guppy was eaten\n");
        }

    }

    reproduce(){
        let r = 0.5;
        //size doesn't matter!
        if(this.color==GuppyColor.Bright){
            r=0.8; //it's goodlooking and attractive!
        }
        else{
            r=0.3;
        }

        let chance = Math.random();
        if(chance < r){
            // for simplicity we just do that one guppy makes one child
            
            
            //RANDOM VARIATION
            let sameColorChance = 0.8;
            let sameSizeChance = 0.8;

            // slightliy different position than parent cause otherwise it overlaps

            // CHANGE HARDCODED COORDS to globals
            let child_x = Phaser.Math.Clamp(Phaser.Math.Between(-40,40)+this.x,128,900);
            let child_y = Phaser.Math.Clamp(Phaser.Math.Between(-40,40)+this.y,128,600);

            let oppositeColor = this.color === GuppyColor.Bright ? GuppyColor.Dull : GuppyColor.Bright;
            let oppositeSize = this.size === GuppySize.Big ? GuppySize.Small : GuppySize.Big;

            let colorRand = Math.random();
            let sizeRand = Math.random();

            let childColor = colorRand < sameColorChance ? this.color : oppositeColor;
            let childSize = sizeRand < sameSizeChance ? this.size : oppositeSize;

            const childGuppy = new Guppy(this.scene, child_x, child_y, childColor, childSize);
            this.scene.guppies.push(childGuppy);
            console.log("guppy reproduced "+ chance + "/" + r);

        }
        else{
            console.log("guppy didn't reproduce "+ chance + "/" + r);
        }


    }

}
