import { Container, FederatedPointerEvent, Sprite, Texture, TextStyle, Text, BLEND_MODES } from "pixi.js";
import { IScene, Manager } from "./manager";
import { scene_menu } from './scene_menu'; 

export class scene_particles extends Container implements IScene{



    // We promoted clampy to a member of the class
    private background: Sprite;
    private BackButton: Sprite;
    
    private FPS_style: TextStyle;
    private FPS_Text: Text;

    private FlameTextures: Array<Texture>;
    private Flames: Array<{FrameTimer:number, TexID:number, sprite:Sprite}>; ;


    constructor() {
        super(); // Mandatory! This calls the superclass constructor.
       
        // Add background
        this.background = Sprite.from("background-flame.jpg");
        this.background.anchor.set(0.0);
        this.background.x = 0;
        this.background.y = 0;
        this.addChild(this.background);
            
            // Load Flames textures
        this.FlameTextures = new Array;
        for (let i = 0; i<9;i++)
        {
            this.FlameTextures[i] = Texture.from('flames/'+i+'.jpg');
        }
        console.log(this.FlameTextures);
   
        this.Flames = new Array;
        for (let i = 0; i<8;i++)
        {
            this.Flames[i] = {FrameTimer: i*20, TexID:i, sprite: new Sprite( this.FlameTextures[i])};
            this.Flames[i].sprite.x= Manager.Scaled_width*0.5;
            this.Flames[i].sprite.y= Manager.Scaled_height*2;
            this.Flames[i].sprite.width     = 1;
            this.Flames[i].sprite.height    = 1;
            this.Flames[i].sprite.anchor.set(0.5, 0.9);
            this.Flames[i].sprite.alpha = i*0.1;
            this.Flames[i].sprite.blendMode = BLEND_MODES.SCREEN
            this.addChild(this.Flames[i].sprite);

        }


        // Back Button
        this.BackButton = Sprite.from("menu_back.png");
        this.BackButton.anchor.set(0.0);
        this.BackButton.x = -150;
        this.BackButton.y = -150;
        this.BackButton.on("pointertap", (e: FederatedPointerEvent)=>{this.ButtonInteraction(e)},this);
        this.BackButton.eventMode = 'dynamic';
        this.BackButton.cursor = 'pointer';
        this.addChild(this.BackButton);
        
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

    private ButtonInteraction(e: FederatedPointerEvent): void {
        console.log(e)
        Manager.changeScene(new scene_menu());
    }

    public update(): void 
    {
        // Update FPS Counter
        this.FPS_Text.text = "FPS:"+Manager.FPS;
        this.FPS_Text.x =  Manager.Scaled_width-this.FPS_Text.width-5;

        // quick back button slide
        this.BackButton.x *=0.8;
        this.BackButton.y *=0.8;
        
        // scale Background
        this.background.width  = Manager.Scaled_width;
        this.background.height = Manager.Scaled_height;

        // Update Flames positions and alpha
        for (let i = 0; i<this.Flames.length;i++)
        {
                this.Flames[i].sprite.width     -= Manager.Delta*0.05;
                this.Flames[i].sprite.height    =  this.Flames[i].sprite.width * 2.5;
                this.Flames[i].sprite.alpha     -= Manager.Delta*0.001;
                this.Flames[i].sprite.y  -= Manager.Delta*0.2*this.Flames[i].sprite.alpha;
                if (this.Flames[i].sprite.y < Manager.Scaled_height) this.Flames[i].sprite.y = Manager.Scaled_height;

                this.Flames[i].FrameTimer += Manager.Delta;
                if (this.Flames[i].FrameTimer>70)
                {
                    this.Flames[i].FrameTimer -=70;
                    this.Flames[i].TexID ++;
                    if (this.Flames[i].TexID==9) this.Flames[i].TexID = 0;
                }
               
                this.Flames[i].sprite.texture =  this.FlameTextures[this.Flames[i].TexID];

                if (this.Flames[i].sprite.alpha<0)
                {
                    this.Flames[i].sprite.x= Manager.Scaled_width*0.5+Math.cos( Math.random()*3.14)*150;
                    this.Flames[i].sprite.width = 350+Math.random()*300; 
                    this.Flames[i].sprite.y = Manager.Scaled_height + this.Flames[i].sprite.height;
                    this.Flames[i].sprite.alpha = 2.0+Math.random()*3.0;
                    this.Flames[i].TexID = 0;
                }
    
        }


    }


}
