class Room < ActiveRecord::Base
	has_many :songs, dependent: :destroy

	# validates :name, presence: true, uniqueness: true

	def current_song
		songs[song_counter]
	end

	def next_song
		songs[song_counter + 1]
	end

	def increment_counter
		self.song_counter += 1
		self.save
	end

end