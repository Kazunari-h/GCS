onload =function(){

	var box_number = [
		[ 0 ,  1,  2,  3 ],
		[ 4 ,  5,  6,  7 ],
		[ 8 ,  9, 10, 11 ],
		[ 12, 13, 14, 15 ]
	];

	/*グラコロのカロリー　427kcal*/
	var sozaiBox = new Array(4);

	for (y=0; y<sozaiBox.length; y++){
		sozaiBox[y] = new Array(2);
	}

	var copyBox = sozaiBox ;
	var jgBox = sozaiBox;
	var hantei1 = new Array(4);
	var playPoint = 0;
	var countBack = 0;
	var playTurn = 0;
	var kanseiFlg=0;
	var komu = 1;
	var cm = 2;
	var pan = 3;
	var ck = 4;
	var kansei = 5;
	var timer;

	var up = 1;
	var down = 4;
	var left = 2;
	var right = 3;

	var Height_Number = 4;
	var Width_Number = 4;

		/* タッチ＆フリック機能*/
	var touchStartX;
	var touchStartY;
	var touchMoveX;
	var touchMoveY;
	var moveDistanceX;
	var moveDistanceY;

	//===============================================================================
	// フリックイベント用
	//タッチはじめの位置をとる
	var planA = function(event){
		event.preventDefault();
		// 座標の取得
		touchStartX = event.touches[0].pageX;
		touchStartY = event.touches[0].pageY;
	};

	//タッチ終わりの位置をとる
	var planB = function(event){
		event.preventDefault();
		// 座標の取得
		touchMoveX = event.changedTouches[0].pageX;
		touchMoveY = event.changedTouches[0].pageY;
	};

	//移動量をとる
	var planC = function(event){
		// 移動量の判定
		moveDistanceX = Math.abs(touchStartX-touchMoveX);
		moveDistanceY = Math.abs(touchStartY-touchMoveY);

		if(moveDistanceX > moveDistanceY){
			if (touchStartX > touchMoveX) {
			    if (touchStartX > (touchMoveX + 50)) {
			    //右から左に指が移動した場合
			    	changeBoxleft();
			    	$('left').value = "左" + touchStartX;
			    }
			} else if (touchStartX < touchMoveX) {
			    if ((touchStartX + 50) < touchMoveX) {
			    //左から右に指が移動した場合
			    	changeBoxright();
			    	$('right').value = "右" + touchStartX;
			    }
			}
		} else {
			if (touchStartY > touchMoveY) {
			    if (touchStartY > (touchMoveY + 50)) {
			    //上に指が移動した場合
			    	changeBoxup();
			    	$('up').value = "上" + touchStartX;
			    }
			} else if (touchStartY < touchMoveY) {
			    if ((touchStartY + 50) < touchMoveY) {
			    //下に指が移動した場合
			    	changeBoxdown();
			    	$('down').value = "下" + touchStartX;
			    }
			}
		}
	};


	//タッチのアクション発動。
	function touchAction(){
		// 開始時
		window.addEventListener("touchstart", planA, false);

		// 移動時
		window.addEventListener("touchmove", planB, false);

		// 終了時
		window.addEventListener("touchend", planC, false);
	}

	//タッチアクションを取り消す。無効化する。
	function removeAction(){
		// 開始時
		window.removeEventListener("touchstart", planA, false);

		// 移動時
		window.removeEventListener("touchmove", planB, false);

		// 終了時
		window.removeEventListener("touchend", planC, false);
	}

	//===============================================================================


	//===============================================================================
	// 音楽ファイル再生のためのオブジェクトの初期化　※Phone Gapでは使えない。
	var au = new Audio();
	// 音楽ファイルの設定
	au.src = "se2.wav";
	//===============================================================================


	//===============================================================================
	// ゲームスタートボタンをおした時
	$('button1').click(function(){
		// 音楽ファイルの再生
		au.play();
		// ゲームスタート
		gameStart();
		//タッチアクションを有効化
		touchAction();
		// スタート画面を非表示
		$("#startTitle").css('display','none');
		// ゲーム画面を表示
		$("#gameDisplay").css('display','none');
	});

	//===============================================================================
	// PC用テストコントローラー　

	// 上をおした時
	$('up').click(function(){
		changeBoxup();
	});
	// 下をおした時
	$('down').click(function(){
		changeBoxdown();
	});

	// 左をおした時
	$('left').click(function(){
		changeBoxleft();
	});

	// 右をおした時
	$('right').click(function(){
		changeBoxright();
	});

	// 戻るをおした時
	$('back').click(function(){
		sozaiBox = copyBox;
		// 画面に表示
		monitorBox();
		// 戻った回数をカウント
		countBack++;
	});

	/**
	* ゲームスタート関数
	* ①素材ボックスを初期化
	* ②初期の値を配置
	* ③画面に表示
	*/
	function gameStart(){
		// 変数を初期化

		countBack = 0;
		playTurn = 0;
		playPoint = 0;

		// 全ての素材ボックスに0を入れる
		for(var i = 0 ; i< Width_Number; i++){
			for(var j = 0 ; j < Height_Number; j++){
				sozaiBox[i][j] = 0;
			}
		}

		//3つ初期の値を入れておく
		for(var i = 0 ; i< 3 ; i++){
			//ランダムな位置を設定
			var count1 = random(4);
			var count2 = random(4);
			// もし、ランダムで決めた位置が0ならランダムな値を入れる。
			if(sozaiBox[count1][count2] == 0){
				sozaiBox[count1][count2] = random(4) + 1;
			}else{
				i = i - 1 ;
			}
		}
		// 画面に表示
		monitorBox();
	}

	//パズル画面に空きがあると値を追加する。
	//画面がブロックで埋まってるか埋まってないかを判定。
	function gameCont(move_direction){
		var False_count = 0;
		var zero_count = 0;
		for (var i = 0; i < Width_Number; i++) {
			for (var j = 0; j < Height_Number; j++) {
				if (sozaiBox[i][j] == 0) {
					zero_count++;
				}
				if(sozaiBox[i][j] != copyBox[i][j]){
					False_count++;
				}
			}
		}

		if (False_count == 0 && zero_count != 0) {
			monitorBox(null,null,move_direction);
		}else if ( zero_count > 0 ) {
			var flg = true;
			do{
				var wnum = random(4);
				var hnum = random(4);
				if(sozaiBox[hnum][wnum] == 0){
					sozaiBox[hnum][wnum] = random(4) + 1 ;
					flg = false;
				}
			}while(flg);
			monitorBox(wnum,hnum,move_direction);
		}else{
			monitorBox(null,null,move_direction);
			gameOver();
		}
	}

	//ゲームオーバーの処理
	function gameOver(){
		//game overをアラート表示
		alert('ゲームオーバー'+playPoint+'キロカロリー');
		//アラート消したらゲームスタート
		gameStart();
	}


	//ボックス等を画面に表示するときに使う。ゲームエフェクト
	function monitorBox(Width_Number,Height_Number,move_direction){

	}


	//素材ボックスの色、画像を決めている。
	function imageDisplay(){

		// 全ての素材ボックスに0を入れる
		for(var i = 0 ; i< Width_Number; i++){
			for(var j = 0 ; j < Height_Number; j++){
				if(sozaiBox[i][j] == 0){
					$('b'+box_number[i][j]).style.backgroundImage = 'none';
					$('b'+box_number[i][j]).style.backgroundColor = 'white';
				}else{
					if(sozaiBox[i][j]== komu){
						$('b'+box_number[i][j]).style.backgroundColor = 'yellow';
						$('b'+box_number[i][j]).style.backgroundImage = 'url(1.png)';
					}else if(sozaiBox[i][j]== cm){
						$('b'+box_number[i][j]).style.backgroundColor = 'green';
						$('b'+box_number[i][j]).style.backgroundImage = 'url(2.png)';
					}else if(sozaiBox[i][j]== pan){
						$('b'+box_number[i][j]).style.backgroundColor = 'violet';;
						$('b'+box_number[i][j]).style.backgroundImage = 'url(4.png)';
					}else if(sozaiBox[i][j]== ck){
						$('b'+box_number[i][j]).style.backgroundColor = 'orange';
						$('b'+box_number[i][j]).style.backgroundImage = 'url(3.png)';
					}else if(sozaiBox[i][j]== kansei){
						$('b'+box_number[i][j]).style.backgroundColor = 'black';
						$('b'+box_number[i][j]).style.backgroundImage = 'url(6.png)';
					}
				}
			}
		}
	}


	// 上に動かした時のアクション
	function changeBoxup(){
		copyBox = sozaiBox;

		for(var wi = 0 ; wi < Width_Number ; wi++){
			for(var hi = 0 ; hi < Height_Number ; hi++){
				hantei1[3 - hi] = sozaiBox[hi][wi];
			}
			//判定の前処理
			changeBox();
			for(var hi = 0 ; j < Height_Number ; j++){
				sozaiBox[hi][wi] = hantei1[3 - hi];
			}
		}
		gameCont(up);
	}

	// 下に動かした時のアクション
	function changeBoxdown(){
		copyBox = sozaiBox;

		for(var wi = 0 ; wi < Width_Number ; wi++){
			for(var hi = 0 ; hi < Height_Number ; hi++){
				hantei1[hi] = sozaiBox[hi][wi];
			}
			//判定の前処理
			changeBox();
			for(var hi = 0 ; j < Height_Number ; j++){
				sozaiBox[hi][wi] = hantei1[hi];
			}
		}
		gameCont(down);
	}

	// 左に動かした時のアクション
	function changeBoxleft(){

		copyBox = sozaiBox;

		for(var hi = 0 ; hi < Height_Number ; hi++){
			for(var wi = 0 ; wi < Width_Number ; wi++){
				hantei1[3 - wi] = sozaiBox[hi][wi];
			}
			//判定の前処理
			changeBox();
			for(var wi = 0 ; wi < Width_Number ; wi++){
				sozaiBox[hi][wi] = hantei1[3 - wi];
			}
		}

		//judgeGura();
		gameCont(left);

	}

	// 右に動かした時のアクション
	function changeBoxright(){
		copyBox = sozaiBox;
		for(var hi = 0 ; hi < Height_Number ; hi++){
			for(var wi = 0 ; wi < Width_Number ; wi++){
				hantei1[3 - wi] = sozaiBox[hi][wi];
			}
			//判定の前処理
			changeBox();
			for(var wi = 0 ; wi < Width_Number ; wi++){
				sozaiBox[hi][wi] = hantei1[3 - wi];
			}
		}
		gameCont(right);
	}


	// 判定
	function changeBox(){

		var change_flg = false;

		if(
			(hantei1[0] == ck && hantei1[1] == pan && hantei1[2] == ck ) ||
			(hantei1[1] == ck && hantei1[2] == pan && hantei1[3] == ck ) ||
			(hantei1[0] == ck && hantei1[1] == pan && hantei1[3] == ck && hantei1[2] == 0) ||
			(hantei1[0] == ck && hantei1[2] == pan && hantei1[3] == ck && hantei1[1] == 0)){

				change_flg = true;

				if(hantei1[1] == ck && hantei1[2] == pan && hantei1[3] == ck){

					hantei1[1] = 0;
					hantei1[2] = 0;
					hantei1[3] = kansei;

				}else if(hantei1[0] == ck && hantei1[2] == pan && hantei1[3] == ck && hantei1[1] == 0) {

					hantei1[0] = 0;
					hantei1[2] = 0;
					hantei1[3] = kansei;

				}else if(hantei1[0] == ck && hantei1[1] == pan && hantei1[3] == ck && hantei1[2] == 0){

					hantei1[0] = 0;
					hantei1[1] = 0;
					hantei1[3] = kansei;

				}else {

					hantei1[0] = 0;
					hantei1[1] = 0;
					hantei1[2] = kansei;

				}

		}

		if((hantei1[0] == hantei1[1] && hantei1[1] == hantei1[2] && hantei1[2] == hantei1[3] && hantei1[0] == komu )){

				change_flg = true;

				hantei1[0] = 0;
				hantei1[1] = 0;
				hantei1[2] = 0;
				hantei1[3] = ck;

		}

		if(
				(hantei1[0] == hantei1[1] && hantei1[0] == hantei1[2] && hantei1[0] == komu) ||
				(hantei1[0] == hantei1[1] && hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[2] == 0) ||
				(hantei1[0] == hantei1[2] && hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[1] == 0) ||
				(hantei1[1] == hantei1[2] && hantei1[1] == hantei1[3] && hantei1[1] == komu) ){

				change_flg = true;

				if(hantei1[0] == hantei1[1] && hantei1[0] == hantei1[2] && hantei1[0] == komu){

					hantei1[0] = 0;
					hantei1[1] = 0;

					hantei1[2] = pan;

				}

				if(hantei1[0] == hantei1[1] && hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[2] == 0){

					hantei1[0] = 0;
					hantei1[1] = 0;

					hantei1[3] = pan;

				}

				if(hantei1[0] == hantei1[2] && hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[1] == 0){

					hantei1[0] = 0;
					hantei1[2] = 0;

					hantei1[3] = pan;

				}

				if(hantei1[1] == hantei1[2] && hantei1[1] == hantei1[3] && hantei1[1] == komu ){

					hantei1[1] = 0;
					hantei1[2] = 0;

					hantei1[3] = pan;

				}
		}

		if(
			(hantei1[0] == hantei1[1] && hantei1[0] == komu ) ||
			(hantei1[1] == hantei1[2] && hantei1[1] == komu ) ||
			(hantei1[2] == hantei1[3] && hantei1[2] == komu ) ||
			(hantei1[0] == hantei1[2] && hantei1[0] == komu && hantei1[1] == 0) ||
			(hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[1] == hantei1[2] && hantei1[1] == 0) ||
			(hantei1[1] == hantei1[3] && hantei1[1] == komu && hantei1[2] == 0)){

				change_flg = true;

				if(hantei1[2] == hantei1[3] && hantei1[2] == komu){

					hantei1[2] = 0;
					hantei1[3] = cm;

				}

				if(hantei1[1] == hantei1[2] && hantei1[1] == komu){

					hantei1[1] = 0;
					hantei1[2] = cm;

				}

				if(hantei1[1] == hantei1[3] && hantei1[1] == komu && hantei1[2] == 0){

					hantei1[1] = 0;
					hantei1[3] = cm;

				}

				if(hantei1[0] == hantei1[3] && hantei1[0] == komu && hantei1[1] == hantei1[2] && hantei1[1] == 0){

					hantei1[0] = 0;
					hantei1[3] = cm;

				}

				if(hantei1[0] == hantei1[2] && hantei1[0] == komu && hantei1[1] == 0){

					hantei1[0] = 0;
					hantei1[2] = cm;

				}

				if(hantei1[0] == hantei1[1] && hantei1[0] == komu ){

					hantei1[0] = 0;
					hantei1[1] = cm;

				}

		//クリーム　●●○○、●○●○、●○○●、○●●○、○●○●、○○●●の　場合クリームコロッケ
		}
		if(
			(hantei1[0] == hantei1[1] && hantei1[0] == cm ) ||
			(hantei1[0] == hantei1[2] && hantei1[0] == cm && hantei1[1] == 0) ||
			(hantei1[0] == hantei1[3] && hantei1[0] == cm && hantei1[1] == hantei1[2] && hantei1[1] == 0) ||
			(hantei1[1] == hantei1[3] && hantei1[1] == cm && hantei1[2] == 0) ||
			(hantei1[1] == hantei1[2] && hantei1[1] == cm ) ||
			(hantei1[2] == hantei1[3] && hantei1[2] == cm ) ){

			change_flg = true;

			if(hantei1[2] == hantei1[3] && hantei1[2] == cm ){

				hantei1[2] = 0;
				hantei1[3] = ck;

			}

			if(hantei1[1] == hantei1[2] && hantei1[2] == cm ){

				hantei1[1] = 0;
				hantei1[2] = ck;

			}

			if(hantei1[1] == hantei1[3] && hantei1[1] == cm && hantei1[2] == 0){

				hantei1[1] = 0;
				hantei1[3] = ck;

			}

			if(hantei1[0] == hantei1[3] && hantei1[0] == cm && hantei1[1] == hantei1[2] && hantei1[1] == 0){

				hantei1[0] = 0;
				hantei1[3] = ck;

			}

			if(hantei1[0] == hantei1[2] && hantei1[0] == cm && hantei1[1] == 0){

				hantei1[0] = 0;
				hantei1[2] = ck;

			}

			if (hantei1[0] == hantei1[1] && hantei1[0] == cm ) {

				hantei1[0] = 0;
				hantei1[1] = ck;

			}

		}

		alignmentBox();
		return change_flg;
	}

	/*　全てを端に寄せる */
	function alignmentBox(){
		for (var j = 3; j >= 0 ; j--) {
			for (var i = 3; i > 0; i--) {
				if(hantei1[i] == 0 ){
					hantei1[i] = hantei1[i - 1] ;
					hantei1[i - 1] = 0;
				}
			}
		}
	}

	/*　動いたボックスの位置を記録　*/
	function moveBox(){
		for (var i = 0; i < 16; i++) {
			if(sozaiBox[i] != copyBox[i] && sozaiBox[i] != 0){
				jgBox[i] = 1 ;
			}else{
				jgBox[i] = 0 ;
			}
		}
	}

	/*　便利かな？*/
	function $(id){
		return document.getElementById(id);
	}

	//0~iのランダムな数字を出力する
	function random(i){
		return Math.floor(Math.random() * i);
	}

}
