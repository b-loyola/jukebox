class Room < ActiveRecord::Base
	has_many :songs, dependent: :destroy

	# validates :name, presence: true, uniqueness: true

	def next_song
		current_song = songs[song_counter]
		if current_song && (song_counter < songs.size)
			self.song_counter += 1
			self.save
		else
			current_song = songs.sample
		end
		current_song
	end

	def send_text(number)
		@account_sid = ENV['TWILIO_SID']
		@auth_token = ENV['TWILIO_TOKEN']
		@recipient = "+1#{number}"
		@link = "10.10.43.144:3000/rooms/#{self.id}"
		
		# set up a client
		@client = Twilio::REST::Client.new(@account_sid, @auth_token)
		@client.account.messages.create(
		  from: '+15874001631',
		  to: @recipient,
		  body: @link
		)
	end

end



