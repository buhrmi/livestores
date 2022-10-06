class User < ApplicationRecord
  has_actionstore
  
  def subscribed channel
    channel.push_update name: name
  end

  def perform_make_message channel, text
    push_append_into 'messages', text: text
  end
end
