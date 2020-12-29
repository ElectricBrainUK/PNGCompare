DESTDIR := build
FOLDER = $(shell basename `pwd`)

.PHONY:
default: $(DESTDIR)/lpcp96_male_open_happy_ruffled_ivory_brunet.png

$(DESTDIR)/%.png:
	./build.sh $@

.PHONY:
preview: $(DESTDIR)/lpcp96_male_open_happy_ruffled_ivory_brunet_eyebrows.png $(DESTDIR)/lpcp96_female_grim_grim_longplaits_coffee_blond_eyebrows.png $(DESTDIR)/lpcp96_male_smile_grin_ruffled_copper_raven.png $(DESTDIR)/lpcp96_female_halfopen_sad_longplaits_sienna_redhead.png $(DESTDIR)/lpcp96_male_open_happy_ruffled_dove_white_eyebrows_longears.png $(DESTDIR)/lpcp96_female_smile_happy_longplaits_gray_green_eyebrows_longears.png $(DESTDIR)/lpcp96_male_grim_meh_none_green_pink_teeth.png $(DESTDIR)/lpcp96_female_open_meh_none_green_blue_teeth.png
	magick montage -mode concatenate -tile 4x  $^ $(DESTDIR)/preview.png

.PHONY:
random_preview:
	magick montage -mode concatenate -tile 4x $(foreach , 1 2 3 4 5 6 7 8, $$(./build.sh --random)) $(DESTDIR)/randompreview.png

%.zip:
	cd ..; zip -r $(FOLDER)/$@ $(FOLDER)/attribution.md $(FOLDER)/Makefile $(FOLDER)/build.sh $(FOLDER)/lpcp96_eyebrows.png $(FOLDER)/base/ $(FOLDER)/emotions/ $(FOLDER)/eyes/ $(FOLDER)/hair/ $(FOLDER)/palette/ $(FOLDER)/special/ $(FOLDER)/lpc-shell-tools/ $(FOLDER)/.git/

attribution.pdf: attribution.md
	pandoc $< -o $@

attribution.html: attribution.md
	pandoc -s --metadata pagetitle="[LPC] Portraits Remix" -t html5 $< -o $@

.PHONY:
buildable:
	chmod +x ./build.sh

.PHONY:
clean:
	-rm -r build/ tmp/ attribution.pdf attribution.html