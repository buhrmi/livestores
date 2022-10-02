class HasActionstoreTest < ActiveSupport::TestCase
  def test_data_can_be_pushed
    user = User.create
    user.push_into 'some_store', some: 'data'
  end
end