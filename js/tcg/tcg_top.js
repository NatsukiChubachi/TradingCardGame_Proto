/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global _gGame */

// TCGトップクラス
var CTcgTop = function() {
    
    // 初期化処理
    this.initialize = function( _game ) 
    {
        // シーン作成
        this._game = _game;
        this._scene = new Scene();
        
        // 背景色
        this._scene.backgroundColor = "#999999";
        
        // ラベル作成
        var lblMsg = new Label( "TCG Top Page." );
        lblMsg.x = 10;
        lblMsg.y = 10;
        lblMsg.font = "16px cursive";
        lblMsg.textAlign = "left";
        this._scene.addChild( lblMsg );

        // 作成したシーンを追加する
        this._game.pushScene( this._scene );
        
        var _newScene = new CTcgBattleField();
        _newScene.initialize( _gGame );
    };
    
    return this;
};


