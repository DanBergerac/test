import { Container, FederatedPointerEvent, Sprite, Texture, TextStyle, Text  } from "pixi.js";
import { IScene, Manager } from "./manager";
import { scene_menu } from './scene_menu'; 

export class scene_cards extends Container implements IScene{



    // We promoted clampy to a member of the class
    private background: Sprite;
    private BackButton: Sprite;
    
    // 
    private FPS_style: TextStyle;
    private FPS_Text: Text;

    private CardsTextures: Array<Texture>;
    
    private Cards: Array<
    {
        Sprite:Sprite,
        Hidden:boolean,
        TexID:number,
        Slide:number
    }>;

    private CardToShow: number;
    private CardToShowTimer: number;
    


    constructor() {
        super(); // Mandatory! This calls the superclass constructor.
       
        //
        this.CardToShow = 143;
        this.CardToShowTimer = 0;

        // Add background
        this.background = Sprite.from("background-cards.jpg");
        this.background.anchor.set(0.0);
        this.background.x = 0;
        this.background.y = 0;
        this.addChild(this.background);

        // Load cards textures
        this.CardsTextures = new Array(); 
        for (let i = 0; i< 53;i++)
        {
            this.CardsTextures[i] = Texture.from('cards/'+i+'.png');
        }

        // Setup Cards Sprites
        this.Cards = new Array(); 
        let TextureID = 1;
        for (let i = 0; i< 144;i++)
        {
            this.Cards[i] = {Slide:0.0, TexID:TextureID, Hidden:true, Sprite:new Sprite(this.CardsTextures[0])};
            this.Cards[i].Sprite.anchor.set(0.5);
            this.Cards[i].Sprite.x = Manager.Scaled_width*0.5-200;
            this.Cards[i].Sprite.y = 800-i*2;
            this.Cards[i].Sprite.width  = 200;
            this.Cards[i].Sprite.height = 300;
            this.addChild(this.Cards[i].Sprite);

            TextureID++; if (TextureID==53) TextureID = 1;
        }
        this.ShuffleCards();

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

    private ShuffleCards()
    {
       
        for (let i = 0; i< 144;i++)
        {  
            var j = Math.floor(Math.random()*144);
            if (j>-1 && j<144)
            {
                var a = this.Cards[i].TexID;
                var b = this.Cards[j].TexID;
                this.Cards[i].TexID = b;
                this.Cards[j].TexID = a;
            }
            this.Cards[i].Hidden = true;
            this.Cards[i].Sprite.texture = this.CardsTextures[0];
            this.Cards[i].Slide = 0;
            this.Cards[i].Sprite.transform.rotation=(Math.random()-0.5)*0.06;
            this.Cards[i].Sprite.scale.x = 0.5;
            this.removeChild(this.Cards[i].Sprite);
            this.addChild(this.Cards[i].Sprite);
        }

        this.CardToShow = 143;
        this.CardToShowTimer = -2000;
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

        // Timer to move a card (un hide)
        this.CardToShowTimer += Manager.Delta;
        if ( this.CardToShowTimer>1000 && this.CardToShow>-1)
        {
            this.CardToShowTimer -=1000;
            let i = this.CardToShow;
            this.Cards[i].Hidden = false;
            this.Cards[i].Slide = 0;
            this.removeChild(this.Cards[i].Sprite);
            this.addChild(this.Cards[i].Sprite);
            this.CardToShow--;
           
            if ( this.CardToShow==-1) this.ShuffleCards();
        }


        // Cards animation
        for (let i = 0; i< 144;i++)
        {
                             
            if (this.Cards[i].Hidden == true)
            {
                this.Cards[i].Sprite.x = Manager.Scaled_width*0.5-120;
                this.Cards[i].Sprite.y = this.Cards[i].Sprite.y*0.95+(800-i*2.5)*0.05;
            }
            else
            {
                
                if (this.Cards[i].Slide!=1.0)
                {
                    if (this.Cards[i].Slide>0.5) this.Cards[i].Sprite.texture = this.CardsTextures[this.Cards[i].TexID];
                    var Xb = Manager.Scaled_width*0.5-120;
                    var Xa = Manager.Scaled_width*0.5+120;

                    var Ya = 800-(144-i)*2.5;
                    var Yb = 800-(i*2.5);

                    this.Cards[i].Slide +=Manager.Delta*0.0005;
                    this.Cards[i].Sprite.transform.rotation=this.Cards[i].Slide*3.14-3.14;
                    if (this.Cards[i].Slide>1.0) 
                    {
                        this.Cards[i].Slide = 1.0;
                        this.Cards[i].Sprite.transform.rotation=(Math.random()-0.5)*0.12;
                    }

                    this.Cards[i].Sprite.x = (Xa*this.Cards[i].Slide)+(Xb* (1.0-this.Cards[i].Slide));
                    this.Cards[i].Sprite.scale.x = this.Cards[i].Slide-0.5;
                    

                    this.Cards[i].Sprite.y = (Ya*this.Cards[i].Slide)+(Yb* (1.0-this.Cards[i].Slide));
                    this.Cards[i].Sprite.y -= (1.0-Math.abs(this.Cards[i].Slide*2.0-1.0))*600;
                }
                else
                {
                    this.Cards[i].Sprite.x = Manager.Scaled_width*0.5+120;
                    this.Cards[i].Sprite.y = 800-(144-i)*2.5;

                }


            }

                
        }

        // quick back button slide
        this.BackButton.x *=0.8;
        this.BackButton.y *=0.8;
        
    
        // scale Background
        this.background.width  = Manager.Scaled_width;
        this.background.height = Manager.Scaled_height;

    }


}
