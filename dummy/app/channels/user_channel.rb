class UserChannel < ApplicationCable::Channel
  def subscribed
    @current_user = User.find(1)

    store('user').set @current_user.as_json

    stream_for @current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end


  def make_message whatever
    UserChannel[@current_user].store('messages').append(whatever['text'])
  end
end
