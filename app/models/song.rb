class Song < ActiveRecord::Base
	belongs_to :room

	validates :url, presence: true, format: {with: /(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/i}
	before_create :convert_url
	before_create :get_title

	def convert_url
		self.url = url[/(youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+))/i, 2]
	end
	
	def get_title
		self.title = Yt::Video.new(id: self.url).title
	end
	
end
