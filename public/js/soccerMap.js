// Generated by CoffeeScript 1.3.3

/* SOCCERMAP CLASS
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.SoccerMap = (function(_super) {
    var curve, data, field;

    __extends(SoccerMap, _super);

    curve = tageswoche.curve;

    field = tageswoche.field;

    data = tageswoche.data;

    function SoccerMap(container, width, settings) {
      var height, self;
      this.settings = settings != null ? settings : {};
      self = this;
      field.scale = width / field.originalWidth;
      height = width / field.widthHeightRelation;
      SoccerMap.__super__.constructor.call(this, container, width, height);
      this.scene = void 0;
      this.actions = [];
      this.black = "#555555";
      this.red = "#EE402F";
      this.blue = "#0051A3";
      this.white = "#FFFFFF";
      this.fcbAttributes = {
        fill: this.red,
        stroke: "",
        "stroke-width": 1.0,
        "stroke-linejoin": "round"
      };
      this.opponentAttributes = {
        fill: this.black,
        stroke: "",
        "stroke-width": 1.0,
        "stroke-linejoin": "round"
      };
      this.numberTextAttributes = {
        fill: "#FFFFFF",
        stroke: "none",
        font: '200 13px "Helvetica Neue", Helvetica, "Arial Unicode MS", Arial, sans-serif'
      };
      this.circleRadius = 11;
      this.playerColor = this.red;
      this.playerAttributes = this.fcbAttributes;
      this.initEvents();
      this.firstScene();
    }

    SoccerMap.prototype.firstScene = function() {
      var _this = this;
      return data.loadScenes(function(error, scenes) {
        _this.scene = data.firstScene();
        return _this.draw();
      });
    };

    SoccerMap.prototype.nextScene = function() {
      this.scene = data.nextScene();
      if (data.isLastScene()) {
        $("#next-scene").css("visibility", "hidden");
      } else {
        $("#prev-scene").css("visibility", "visible");
      }
      return this.draw();
    };

    SoccerMap.prototype.previousScene = function() {
      this.scene = data.previousScene();
      if (data.isFirstScene()) {
        $("#prev-scene").css("visibility", "hidden");
      } else {
        $("#next-scene").css("visibility", "visible");
      }
      return this.draw();
    };

    SoccerMap.prototype.initEvents = function() {
      var _this = this;
      $("#next-scene").click(function() {
        event.preventDefault();
        return _this.nextScene();
      });
      $("#prev-scene").click(function() {
        event.preventDefault();
        return _this.previousScene();
      });
      return $("#scene-list").on("click", "a", function(event) {
        var $this, scene, sceneIndex;
        event.preventDefault();
        $this = $(event.target);
        sceneIndex = $this.parent().data("sceneIndex");
        scene = data.scenes[sceneIndex];
        _this.scene = data.getScene(sceneIndex);
        return _this.draw();
      });
    };

    SoccerMap.prototype.draw = function() {
      var action, first, last, _i, _len, _ref;
      if (this.scene.team.toLowerCase() === "fcb") {
        field.playDirection = "left";
        this.playerColor = this.red;
        this.playerAttributes = this.fcbAttributes;
      } else {
        field.playDirection = "right";
        this.playerColor = this.black;
        this.playerAttributes = this.opponentAttributes;
      }
      this.actions = this.scene.actions;
      _ref = this.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        first = action.positions[0];
        last = action.positions.length > 1 ? action.positions[action.positions.length - 1] : void 0;
        action.start = field.calcPosition(first);
        if (last) {
          action.end = field.calcPosition(last);
        }
      }
      this.map.clear();
      this.drawPasses();
      this.drawPositions();
      this.updateInfo();
      this.sceneInfo();
      return this.setupPopups();
    };

    SoccerMap.prototype.updateInfo = function() {
      var $gameLink, game, scene, sceneIndex, ul, _i, _len, _results;
      $("#scene-result .score").html(this.scene.score);
      $("#scene-result .left").html("FCB");
      if (this.scene.opponent) {
        $("#scene-result .right").html(this.scene.opponent.toUpperCase());
      }
      game = data.games[this.scene.date];
      ul = $("#scene-list").html("");
      _results = [];
      for (_i = 0, _len = game.length; _i < _len; _i++) {
        sceneIndex = game[_i];
        scene = data.scenes[sceneIndex];
        $gameLink = $("<li><a href='' class='" + (scene === this.scene ? "active" : void 0) + "'>" + scene.minute + ".</a></li>");
        $gameLink.data("sceneIndex", sceneIndex);
        _results.push(ul.append($gameLink));
      }
      return _results;
    };

    SoccerMap.prototype.extractSceneInfo = function() {
      var assistAction, goalAction, length;
      length = this.actions.length;
      if (length) {
        goalAction = this.actions[length - 1];
        if (!data.is("Foul", goalAction.specialCondition)) {
          this.scene.goal = goalAction.name;
          if (data.is("Penalty", goalAction.specialCondition)) {
            this.scene.goal = "" + this.scene.goal + " (Penalty)";
          } else if (data.is("Freistoss direkt", goalAction.specialCondition)) {
            this.scene.goal = "" + this.scene.goal + " (Freistoss direkt)";
          } else if (data.is("Freistoss indirekt", goalAction.specialCondition)) {
            this.scene.goal = "" + this.scene.goal + " (Freistoss indirekt)";
          }
          if (length > 1) {
            assistAction = this.actions[length - 2];
            if (!data.is("Foul", assistAction.specialCondition)) {
              return this.scene.assist = assistAction.name;
            }
          }
        }
      }
    };

    SoccerMap.prototype.sceneInfo = function() {
      var desc;
      this.extractSceneInfo();
      desc = $("#scene-desc").html("").append("<em>" + this.scene.team + " &ndash; " + this.scene.minute + ". Minute:</em>").append("<span>Tor: <strong>" + this.scene.goal + "</strong></span>");
      if (this.scene.assist) {
        return desc.append("<span>Assist: <strong>" + this.scene.assist + "</strong></span>");
      }
    };

    SoccerMap.prototype.setupPopups = function() {
      return $(".player").hover(function(event) {
        var $this, playerStatistics, playerStats;
        $this = $(this);
        playerStatistics = tageswoche.tableData.getStatisticsForPopup();
        playerStats = _.find(playerStatistics.list, function(player) {
          return player.nickname === $this.attr("data-playername");
        });
        return console.log(playerStats);
      });
    };

    SoccerMap.prototype.drawPasses = function() {
      var action, lastPosition, _i, _len, _ref;
      lastPosition = void 0;
      _ref = this.actions;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        if (action.end) {
          this.drawSprint(action.start, action.end);
        }
        if (lastPosition) {
          this.addPass(lastPosition, action.start);
        }
        if (data.is("Foul", action.specialCondition)) {
          lastPosition = void 0;
        } else {
          lastPosition = action.end ? action.end : action.start;
        }
      }
      if (lastPosition) {
        return this.drawGoal(lastPosition);
      }
    };

    SoccerMap.prototype.drawPositions = function() {
      var $circle, action, circle, currentAttributes, player, start, _i, _len, _ref, _results;
      _ref = this.actions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        action = _ref[_i];
        currentAttributes = action.number ? this.fcbAttributes : this.playerAttributes;
        if (action.end) {
          start = action.start;
          player = action.end;
        } else {
          player = action.start;
        }
        if (start) {
          this.map.circle(start.x, start.y, this.circleRadius * 0.5).attr(currentAttributes);
        }
        circle = this.map.circle(player.x, player.y, this.circleRadius).attr(currentAttributes);
        $circle = jQuery(circle.node);
        $circle.attr("data-playername", action.name);
        $circle.attr("class", "player");
        if (action.number) {
          _results.push(this.label(player, action.number));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    SoccerMap.prototype.drawSprint = function(start, end) {
      var path;
      path = curve.wavy(start, end, "10%");
      return this.map.path(path).attr({
        fill: "",
        stroke: this.playerColor,
        "stroke-width": 2
      });
    };

    SoccerMap.prototype.addPass = function(start, end) {
      var endGap, length, path, startGap, subCurve;
      path = curve.curve(start, end, "10%", 0.6, "right");
      startGap = 0;
      endGap = 16;
      length = Raphael.getTotalLength(path);
      subCurve = Raphael.getSubpath(path, startGap, length - endGap);
      this.drawArrow(path, {
        length: length - endGap
      });
      return this.map.path(subCurve).attr({
        fill: "",
        stroke: this.white,
        "stroke-width": 2
      });
    };

    SoccerMap.prototype.drawGoal = function(start) {
      var end, foot, path;
      end = field.goalPosition(this.scene.scorePosition.toLowerCase());
      foot = start.y < end.y ? "left" : "right";
      if (field.playDirection === "right") {
        foot = foot === "left" ? "right" : "left";
      }
      path = curve.curve(start, end, "10%", 0.6, foot);
      this.drawArrow(path, {
        size: 10,
        pointyness: 0.3,
        strokeWidth: 3
      });
      return this.map.path(path).attr({
        fill: "",
        stroke: this.white,
        "stroke-width": 3
      });
    };

    SoccerMap.prototype.drawArrow = function(path, _arg) {
      var arrowhead, base, color, length, pointyness, size, strokeWidth, tip;
      length = _arg.length, size = _arg.size, pointyness = _arg.pointyness, strokeWidth = _arg.strokeWidth, color = _arg.color;
      if (length == null) {
        length = Raphael.getTotalLength(path);
      }
      if (size == null) {
        size = 10;
      }
      if (pointyness == null) {
        pointyness = 0.3;
      }
      if (strokeWidth == null) {
        strokeWidth = 2;
      }
      if (color == null) {
        color = this.white;
      }
      if ((length - size) > 5) {
        base = Raphael.getPointAtLength(path, length - size);
        tip = Raphael.getPointAtLength(path, length);
        arrowhead = curve.arrow(base, tip, pointyness);
        return this.map.path(arrowhead).attr({
          fill: "",
          stroke: color,
          "stroke-width": strokeWidth
        });
      }
    };

    SoccerMap.prototype.label = function(position, label) {
      var x;
      x = position.x;
      if (+label > 9 && +label < 20) {
        x -= 1;
      }
      return this.map.text(x, position.y, label).attr(this.numberTextAttributes);
    };

    return SoccerMap;

  })(RaphaelMap);

}).call(this);
