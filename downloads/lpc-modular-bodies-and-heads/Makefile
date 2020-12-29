default: male_wolfbrown_normal_wolf_all.png male_ivory_normal_skeleton_walkcycle_compound.png female_drakegreen_normal_lizard_all.png male_drakegreen_normal_lizard_all.png female_ogregreen_normal_ogre_all.png male_ogregreen_muscular_ogre_all.png female_ivory_normal_human_all.png male_ivory_normal_human_all.png male_ivory_muscular_human_all.png female_ivory_pregnant_human_all.png

male_ivory_ogre_shadow_head.png: no_shadow.png
	cp $< $@

male_ivory_wolf_shadow_head.png: no_shadow.png
	cp $< $@

female_ivory_wolf_shadow_head.png: no_shadow.png
	cp $< $@

female_ivory_ogre_shadow_head.png: female_ivory_human_shadow_head.png
	cp $< $@

female_ivory_ogre_head.png: female_ivory_human_head.png female_ivory_ogre_overlay_head.png
	convert -background none $? -layers flatten $@

%_head_walkcycle.png: %_head.png
	./lpc-shell-tools/duplimap.sh $< $@ ./lpc-shell-tools/animation/head/$(shell echo $* | cut -d'_' -f1)/walkcycle.map.csv 64 64

%_head_slash.png: %_head.png
	./lpc-shell-tools/duplimap.sh $< $@ ./lpc-shell-tools/animation/head/$(shell echo $* | cut -d'_' -f1)/slash.map.csv 64 64

male_ogregreen_%.png: male_ivory_%.png
	./lpc-shell-tools/switchpalette.sh $< $@ palette/skin/ivory.gpl palette/skin/ogre_green.gpl

female_ogregreen_%.png: female_ivory_%.png
	./lpc-shell-tools/switchpalette.sh $< $@ palette/skin/ivory.gpl palette/skin/ogre_green.gpl

male_drakegreen_%.png: male_ivory_%.png
	./lpc-shell-tools/switchpalette.sh $< $@ palette/skin/ivory.gpl palette/skin/drake_green.gpl

female_drakegreen_%.png: female_ivory_%.png
	./lpc-shell-tools/switchpalette.sh $< $@ palette/skin/ivory.gpl palette/skin/drake_green.gpl

male_wolfbrown_%.png: male_ivory_%.png
	./lpc-shell-tools/switchpalette.sh $< $@ palette/skin/ivory.gpl palette/skin/wolf_brown.gpl

female_wolfbrown_%.png: female_ivory_%.png
	./lpc-shell-tools/switchpalette.sh $< $@ palette/skin/ivory.gpl palette/skin/wolf_brown.gpl

%_skeleton_walkcycle_compound.png: %_headless_walkcycle.png male_skeleton_head_walkcycle.png
	magick convert -background none $? -layers flatten $@

%_all.png: %_walkcycle_compound.png %_slash_compound.png
	magick convert -background none -append $? $@ 

.SECONDEXPANSION:
%_compound.png: $$(shell echo $$* | cut -d'_' -f1-3)_headless_$$(shell echo $$* | cut -d'_' -f5).png $$(shell echo $$* | cut -d'_' -f1-2)_$$(shell echo $$* | cut -d'_' -f4)_head_$$(shell echo $$* | cut -d'_' -f5).png $$(shell echo $$* | cut -d'_' -f1-2)_$$(shell echo $$* | cut -d'_' -f4)_shadow_head_$$(shell echo $$* | cut -d'_' -f5).png
	magick convert -background none $? -layers flatten $@

clean:
	-rm -r tmp_*
	-rm *_head_*.png *green_*.png *brown_*.png *_compound.png *_all.png
	-rm *_ogre_shadow_head.png *_wolf_shadow_head.png female_*_ogre_head.png