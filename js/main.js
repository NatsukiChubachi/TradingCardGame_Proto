// グローバル変数
_gGame = null;

// EnchantJs初期化処理
enchant();

// ウィンドウのOnLoad処理
window.onload = function(){
    
    // ゲームウィンドウのコア設定
    var game = new Core(500, 500);              // 画面の横幅、縦幅
    game.fps = 30;                              // フレーム数
    game.fps = 60;
    
    _gGame = game;                              // ゲームクラスの実体
    
    // データのプリロード
    /*
    _gAssetImage = [];
    _gAssetImage.BackGround0 = "dat/stg/bg0000.jpg";
    _gAssetImage.Bullet0000 = "dat/stg/bullet_0000.png";
    _gAssetImage.Effect0000 = "dat/stg/effect_0000.png";
    _gAssetImage.Unit0000_00 = "dat/stg/unit_0000_0000.png";
    _gAssetImage.Unit0000_01 = "dat/stg/unit_0000_0001.png";
    _gAssetImage.Unit0010_00 = "dat/stg/unit_0010_0000.png";
    _gAssetImage.Unit0010_01 = "dat/stg/unit_0010_0001.png";
    
    game.preload(                           // ファイルのプリロード
        _gAssetImage.BackGround0,
        _gAssetImage.Bullet0000,
        _gAssetImage.Effect0000,
        _gAssetImage.Unit0000_00,
        _gAssetImage.Unit0000_01,
        _gAssetImage.Unit0010_00,
        _gAssetImage.Unit0010_01
        ); 
    */
    
    // ゲームのOnLoad時の処理
    game.onload = function()
    {
        var _newScene = new CTcgTop();        // TCG
        _newScene.initialize( game );
    };
    
    // ゲーム処理のスタート
    game.start();
};



