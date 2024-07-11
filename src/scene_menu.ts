import { Container, FederatedPointerEvent, Sprite, TextStyle, Text   } from "pixi.js";
import { IScene, Manager } from "./manager";
import { scene_cards } from './scene_cards'; 
import { scene_text } from './scene_text'; 
import { scene_particles } from './scene_particles'; 

export class scene_menu extends Container implements IScene{



    // We promoted clampy to a member of the class
    private background: Sprite;
    private Buttons:  Array<{ ground: number,y: number, ys: number, sprite: Sprite}>;
    
    private FPS_style: TextStyle;
    private FPS_Text: Text;

    constructor() {
        super(); // Mandatory! This calls the superclass constructor.

        // Add background
        this.background = Sprite.from("background-menu.jpg");
        this.background.anchor.set(0.0);
        this.background.x = 0;
        this.background.y = 0;
        this.addChild(this.background);

        // add button in scene
        this.Buttons = Array(
            { "ground": 1000, "y": -100,  "ys": 0,   "sprite": Sprite.from("menu_but1.png") },
            { "ground": 1000, "y": -50,   "ys": 0,   "sprite": Sprite.from("menu_but2.png") },
            { "ground": 1000, "y": 0,     "ys": 0,   "sprite": Sprite.from("menu_but3.png") }
        );
        for (let i = 0; i<this.Buttons.length;i++)
        {
            this.Buttons[i].sprite.x = Manager.Scaled_width * 0.5;
            this.Buttons[i].sprite.y = this.Buttons[i].y;
            this.Buttons[i].sprite.anchor.set(0.5);
            this.Buttons[i].sprite.on("pointertap", (e: FederatedPointerEvent)=>{this.ButtonInteraction(e,i)},this);
            this.Buttons[i].sprite.eventMode = 'dynamic';
            this.Buttons[i].sprite.cursor = 'pointer';
            this.addChild(this.Buttons[i].sprite);
        }

        // Setup FPS text counter
        this.FPS_style = new TextStyle({
            fontFamily: ['Helvetica'],
            fontSize: 25,
            align:"right",
          });
        this.FPS_Text = new Text("FPS:123",this.FPS_style);
        this.FPS_Text.x =  Manager.Scaled_width-120;
        this.FPS_Text.y = 20;
        this.addChild(this.FPS_Text);  
    }

    private ButtonInteraction(e: FederatedPointerEvent, id:number): void {
        console.log(e)
        if (id==0) Manager.changeScene(new scene_cards());
        if (id==1) Manager.changeScene(new scene_text()); 
        if (id==2) Manager.changeScene(new scene_particles()); 
        
        
    }

    public update(): void 
    {
        // Update FPS Counter
        this.FPS_Text.text = "FPS:"+Manager.FPS;
        this.FPS_Text.x =  Manager.Scaled_width-this.FPS_Text.width-5;

        this.Buttons[2].ground = Manager.Scaled_height*0.7;
        this.Buttons[1].ground = this.Buttons[2].y-100;
        this.Buttons[0].ground = this.Buttons[1].y-100;

        for (let i = 0; i<this.Buttons.length;i++)
        {
            
            this.Buttons[i].ys +=Manager.Delta*0.003;// gravity
            this.Buttons[i].y += this.Buttons[i].ys*Manager.Delta; // apply velocity

            if (this.Buttons[i].y> this.Buttons[i].ground) // ground bounce
            {
                this.Buttons[i].ys = -this.Buttons[i].ys*0.6; 
                this.Buttons[i].y= this.Buttons[i].ground ;
            }
            
            this.Buttons[i].sprite.x = Manager.Scaled_width * 0.5; // center sprite
            this.Buttons[i].sprite.y = this.Buttons[i].y; // set sprite y pos
        }
        

        // scale bacground
        this.background.width  = Manager.Scaled_width;
        this.background.height = Manager.Scaled_height;

    }


}
