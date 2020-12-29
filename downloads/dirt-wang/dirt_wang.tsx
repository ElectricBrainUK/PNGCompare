<?xml version="1.0" encoding="UTF-8"?>
<tileset name="dirt_wang" tilewidth="32" tileheight="32" tilecount="36" columns="6">
 <image source="dirt_wang.png" width="192" height="192"/>
 <terraintypes>
  <terrain name="Empty" tile="3"/>
  <terrain name="Dirt" tile="19"/>
 </terraintypes>
 <tile id="1" terrain="1,1,1,0"/>
 <tile id="2" terrain="1,1,0,1"/>
 <tile id="3" terrain="0,0,0,0"/>
 <tile id="4" terrain="1,0,0,1"/>
 <tile id="5" terrain="0,1,1,0"/>
 <tile id="7" terrain="1,0,1,1"/>
 <tile id="8" terrain="0,1,1,1"/>
 <tile id="12" terrain="0,0,0,1"/>
 <tile id="13" terrain="0,0,1,1"/>
 <tile id="14" terrain="0,0,1,0"/>
 <tile id="18" terrain="0,1,0,1"/>
 <tile id="19" terrain="1,1,1,1"/>
 <tile id="20" terrain="1,0,1,0"/>
 <tile id="24" terrain="0,1,0,0"/>
 <tile id="25" terrain="1,1,0,0"/>
 <tile id="26" terrain="1,0,0,0"/>
 <tile id="30" terrain="1,1,1,1" probability="0.01"/>
 <tile id="31" terrain="1,1,1,1" probability="0.01"/>
 <tile id="32" terrain="1,1,1,1" probability="0.01"/>
 <wangsets>
  <wangset name="Dirt" tile="19">
   <wangcornercolor name="" color="#ff0000" tile="-1" probability="1"/>
   <wangcornercolor name="" color="#00ff00" tile="-1" probability="1"/>
   <wangtile tileid="1" wangid="0x20201020"/>
   <wangtile tileid="2" wangid="0x20102020"/>
   <wangtile tileid="3" wangid="0x10101010"/>
   <wangtile tileid="4" wangid="0x20102010"/>
   <wangtile tileid="5" wangid="0x10201020"/>
   <wangtile tileid="7" wangid="0x20202010"/>
   <wangtile tileid="8" wangid="0x10202020"/>
   <wangtile tileid="12" wangid="0x10102010"/>
   <wangtile tileid="13" wangid="0x10202010"/>
   <wangtile tileid="14" wangid="0x10201010"/>
   <wangtile tileid="18" wangid="0x10102020"/>
   <wangtile tileid="19" wangid="0x20202020"/>
   <wangtile tileid="20" wangid="0x20201010"/>
   <wangtile tileid="24" wangid="0x10101020"/>
   <wangtile tileid="25" wangid="0x20101020"/>
   <wangtile tileid="26" wangid="0x20101010"/>
   <wangtile tileid="30" wangid="0x20202020"/>
   <wangtile tileid="31" wangid="0x20202020"/>
   <wangtile tileid="32" wangid="0x20202020"/>
  </wangset>
  <wangset name="Dirt Path" tile="15">
   <wangedgecolor name="" color="#ff0000" tile="-1" probability="1"/>
   <wangedgecolor name="" color="#00ff00" tile="-1" probability="1"/>
   <wangtile tileid="3" wangid="0x1010101"/>
   <wangtile tileid="9" wangid="0x1020201"/>
   <wangtile tileid="10" wangid="0x2010201"/>
   <wangtile tileid="11" wangid="0x2020101"/>
   <wangtile tileid="15" wangid="0x1020102"/>
   <wangtile tileid="16" wangid="0x2020202"/>
   <wangtile tileid="17" wangid="0x2020102"/>
   <wangtile tileid="21" wangid="0x1010202"/>
   <wangtile tileid="22" wangid="0x2010202"/>
   <wangtile tileid="23" wangid="0x2010102"/>
   <wangtile tileid="27" wangid="0x1020202"/>
   <wangtile tileid="28" wangid="0x2020201"/>
   <wangtile tileid="29" wangid="0x2010101"/>
   <wangtile tileid="33" wangid="0x1010102"/>
   <wangtile tileid="34" wangid="0x1020101"/>
   <wangtile tileid="35" wangid="0x1010201"/>
  </wangset>
 </wangsets>
</tileset>
