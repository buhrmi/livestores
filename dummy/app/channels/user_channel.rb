class UserChannel < ApplicationCable::Channel
  def subscribed
    @current_user = User.find(1)

    state('user').set @current_user.as_json

    stream_for @current_user
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

end
